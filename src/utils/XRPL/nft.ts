import * as xrpl from "xrpl";
import { Account } from "./account";
import { Core } from "./core";
import {
    AccountNFTsRequest,
    AccountNFTsResponse,
    Transaction,
    TxResponse
} from "xrpl";

export class NFT {
    async mintNft(nftUrl: string): Promise<{ tx: TxResponse; nfts: AccountNFTsResponse }> {
        try {
            const client = await Core.getClient();
            const accounts = Account.loadWallets();

            const transactionBlob: Transaction = {
                TransactionType: "NFTokenMint",
                Account: accounts.coldWallet.classicAddress,
                URI: xrpl.convertStringToHex(nftUrl),
                Flags: 8,
                TransferFee: 1,
                NFTokenTaxon: 0, // Required, but if you have no use for it, set to zero.
            };

            const tx = await client.submitAndWait(
                transactionBlob,
                { wallet: accounts.coldWallet }
            );

            const nfts = await client.request({
                command: "account_nfts",
                account: accounts.coldWallet.classicAddress,
            } as AccountNFTsRequest);

            await client.disconnect();

            return { tx, nfts };
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Error in minting NFT: ${error.message}`);
            } else {
                throw new Error("An unexpected error occurred in minting NFT.");
            }
        }
    }

    async getTokens(): Promise<AccountNFTsResponse> {
        try {
            const client = await Core.getClient();
            const accounts = Account.loadWallets();

            const nfts = await client.request({
                command: "account_nfts",
                account: accounts.coldWallet.classicAddress,
            } as AccountNFTsRequest);

            await client.disconnect();

            return nfts;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Error in getting NFT: ${error.message}`);
            } else {
                throw new Error("An unexpected error occurred in getting NFT.");
            }
        }
    }
}
