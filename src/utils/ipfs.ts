// utils/uploadToIpfs.ts
import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

const {PINATA_API_KEY, PINATA_SECRET_KEY} = process.env;

const pinataBaseUrl = 'https://api.pinata.cloud/pinning';

interface NftMetadata {
  name: string;
  description?: string;
  image?: string;
  external_url?: string;
  attributes?: Record<string, unknown>[];
}

async function uploadToPinata(fileStream: fs.ReadStream, filename: string) {
  const data = new FormData();
  data.append('file', fileStream, {filename});
  const response = await axios.post(`${pinataBaseUrl}/pinFileToIPFS`, data, {
    headers: {
      'Content-Type': `multipart/form-data; boundary=${data.getBoundary()}`,
      'pinata_api_key': PINATA_API_KEY,
      'pinata_secret_api_key': PINATA_SECRET_KEY,
    },
  });

  return response.data.IpfsHash;
}

export async function uploadNftAndCsvToIpfs(
  metadata: NftMetadata,
  csvFilePath: string
): Promise<{ nftMetadataCid: string; csvFileCid: string }> {
  // Upload CSV file
  const csvFileStream = fs.createReadStream(csvFilePath);
  const csvFileCid = await uploadToPinata(csvFileStream, 'brainwave.csv');

  // Add CSV file link to metadata
  const csvFileLink = `https://ipfs.io/ipfs/${csvFileCid}`;
  metadata = {
    ...metadata,
    attributes: [
      ...(metadata.attributes || []),
      {
        trait_type:
          'brainwave_csv', value: csvFileLink
      },
    ],
  };

  // Upload NFT metadata
  const metadataJson = JSON.stringify(metadata);
  const metadataBuffer = Buffer.from(metadataJson);
  const metadataResponse = await axios.post(`${pinataBaseUrl}/pinJSONToIPFS`, metadataBuffer, {
    headers: {
      'Content-Type': 'application/json',
      'pinata_api_key': PINATA_API_KEY,
      'pinata_secret_api_key': PINATA_SECRET_KEY,
    },
  });

  const nftMetadataCid = metadataResponse.data.IpfsHash;

  return {nftMetadataCid, csvFileCid};
}