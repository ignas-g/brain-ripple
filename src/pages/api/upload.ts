// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable';
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import {connectToDatabase} from "@/utils/mongodb";
import {saveCsvToS3} from "@/utils/s3";
import {uploadNftAndCsvToIpfs} from "@/utils/ipfs";
import {NFT} from "@/utils/XRPL/nft";

type Data = {}

export const config = {
  api: {
    bodyParser: false
  }
};

const post = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
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
    const url = await saveCsvToS3(newFilename, fileStream);
    const imageUrl = 'https://brain-ripple.s3.eu-west-2.amazonaws.com/nft.png';

    const {nftMetadataCid} = await uploadNftAndCsvToIpfs({ name: name as string, image: imageUrl, description: description as string }, file.filepath);
    const nftMetadataUrl = `https://ipfs.io/ipfs/${nftMetadataCid}`;

    const nft = new NFT();

    const {tx, nfts} = await nft.mintNft(nftMetadataUrl);

    const transactionId = tx.result.hash;

    const nftId = nfts.result.account_nfts[nfts.result.account_nfts.length - 1].NFTokenID as string;

    await fs.unlinkSync(file.filepath);
    await saveNFT({ name: name as string, description: description as string, imageUrl, dataURL: url, s3FileName: newFilename, nftMetadataCid, transactionId, nftId, creator, mintedDate });

    return res.status(201).json({nftId});
  });
};


const saveNFT = async (nftData: { name: string; description: string; imageUrl: string, dataURL: string,  s3FileName: string, nftMetadataCid:string, transactionId: string, nftId: string, creator:string, mintedDate: Date }) => {
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
    return res.status(500).json({});
  }
}
