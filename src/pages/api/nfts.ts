import { NextApiRequest, NextApiResponse } from 'next';
import { NFT } from '../../utils/XRPL/nft';
import * as mongodb from '../../utils/mongodb';
import { AccountNFTsResponse } from 'xrpl';
import { AccountNFToken } from 'xrpl/dist/npm/models/methods/accountNFTs';

interface NftApiResponseData {
    nfts: AccountNFToken[];
}

interface NftApiErrorResponseData {
    error: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<NftApiResponseData | NftApiErrorResponseData>) {
    const { classicAddress } = req.query;

    if (typeof classicAddress !== 'string') {
        res.status(400).json({ error: 'Invalid classicAddress' });
        return;
    }

    try {
        const nft = new NFT();
        const nftsResponse: AccountNFTsResponse = await nft.getTokensByAddress(classicAddress);

        // Connect to MongoDB
        const { _, db } = await mongodb.connectToDatabase();
        const nftsCollection = db.collection('nfts');

        const nfts: AccountNFToken[] = nftsResponse.result.account_nfts;

        // Upsert NFTs in the database
        for (const nft of nfts) {
            await nftsCollection.updateOne(
                { NFTokenID: nft.NFTokenID },
                { $set: { ...nft, classicAddress } },
                { upsert: true }
            );
        }

        // Remove NFTs not present in the latest fetched list
        await nftsCollection.deleteMany({
            classicAddress,
            NFTokenID: { $nin: nfts.map((nft) => nft.NFTokenID) },
        });

        res.status(200).json({ nfts });
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'An unexpected error occurred in getting NFT.';
        res.status(500).json({ error: errorMessage });
    }
}