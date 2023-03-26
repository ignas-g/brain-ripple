// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable';
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import {connectToDatabase} from "@/utils/mongodb";
import {saveCsvToS3} from "@/utils/s3";
import {uploadNftAndCsvToIpfs} from "@/utils/ipfs";
import {NFT} from "@/utils/XRPL/nft";
import csvParser from 'csv-parser';

interface OutputData {
  time: number;
  value: number;
  series: string;
}
async function loadCsvAndConvertToFormat(filePath: string, maxRows?: number): Promise<OutputData[]> {
  const data: OutputData[] = [];
  let rowCount = 0;

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser({ headers: false, mapValues: ({ header, index, value }) => parseFloat(value) }))
      .on('data', (row: number[]) => {
        if (maxRows === undefined || rowCount < maxRows) {
          Object.values(row).forEach((value, colIndex) => {
            const time = rowCount;
            const series = `Series ${colIndex + 1}`;

            data.push({ time, value, series });
          });
          rowCount++;
        } else {
          // @ts-ignore

        }
      })
      .on('end', () => {
        resolve(data);
      })
      .on('error', (error: Error) => {
        reject(error);
      });
  });
}

type Data = {}

export const config = {
  api: {
    bodyParser: false
  }
};

// function to lod duration in milliseconds from start provided
const duration = () => {
  const start = new Date();
  console.log('start',start);
  return (message:string) => {
    const end = new Date();
    const diffMillisecond = end.getTime() - start.getTime();
    console.log(message, diffMillisecond);
  }
}


const post = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const log = duration();

  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    log('form.parse');
    const { thought, ownerAddress } = fields;
    const mintedDate = new Date();

    const creator = ownerAddress as string;

    const name = thought;
    // TODO: Add description field to form
    const description = 'An NFT representing a brainwave data set';

    const file = files.file as formidable.File;
    const fileExtension = (file.originalFilename as string).split(".").pop();
    const newFilename = `${uuidv4()}.${fileExtension}`;

    const fileStream = fs.createReadStream(file.filepath);
    log('before saveCsvToS3');
    const url = await saveCsvToS3(newFilename, fileStream);
    log('after saveCsvToS3');
    const imageUrl = 'https://brain-ripple.s3.eu-west-2.amazonaws.com/nft.png';

    const convertedCSV = await loadCsvAndConvertToFormat(file.filepath, 50);

    const {nftMetadataCid} = await uploadNftAndCsvToIpfs({ name: name as string, image: imageUrl, description: description as string }, file.filepath);
    log('after uploadNftAndCsvToIpfs');
    const nftMetadataUrl = `https://ipfs.io/ipfs/${nftMetadataCid}`;

    const nft = new NFT();

    const {tx, nfts} = await nft.mintNft(nftMetadataUrl);

    const transactionId = tx.result.hash;

    const sortBySerial = nfts.result.account_nfts.sort((a, b) => a.nft_serial - b.nft_serial);

    const nftId = sortBySerial[nfts.result.account_nfts.length - 1].NFTokenID as string;

    await fs.unlinkSync(file.filepath);
    log('after fs.unlinkSync');
    await saveNFT({ name: name as string, description: description as string, imageUrl, dataURL: url, s3FileName: newFilename, nftMetadataCid, transactionId, nftId, creator, mintedDate, convertedCSV });
    log('after saveNFT');

    return res.status(201).json({nftId});
  });
};


const saveNFT = async (nftData: { name: string; description: string; imageUrl: string, dataURL: string,  s3FileName: string, nftMetadataCid:string, transactionId: string, nftId: string, creator:string, mintedDate: Date, convertedCSV:OutputData[] }) => {
  const { db } = await connectToDatabase();
  const collection = db.collection("nfts");
  await collection.insertOne(nftData);
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method === "POST") {
      return post(req, res);
    }
    return res.status(404).json({});
  } catch (e) {
    console.error(e);
    return res.status(500).json({e});
  }
}
