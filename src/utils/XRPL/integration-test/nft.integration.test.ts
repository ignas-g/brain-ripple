import { NFT } from "../nft";
import { Account } from "../account";
import * as xrpl from "xrpl";
import { AccountNFTsResponse } from "xrpl";

describe("NFT Integration Tests", () => {
    const nftInstance = new NFT();
    let accounts: Account;

    beforeAll(async () => {
        accounts = Account.loadWallets();
    });

    it("should mint NFT and get account NFTs", async () => {
        const nftUrl = "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi";

        const { tx } = await nftInstance.mintNft(nftUrl);
        expect(tx).toBeDefined();

        if (typeof tx.result.meta === "object") {
            expect(tx.result.meta).toHaveProperty("TransactionResult");
            expect(tx.result.meta.TransactionResult).toBe("tesSUCCESS");
        } else {
            throw new Error("Unexpected meta format in TxResponse");
        }

        const nftsResponse = await nftInstance.getTokens();

        expect(nftsResponse).toBeDefined();

        expect(nftsResponse.result.account).toBe(accounts.coldWallet.classicAddress);
        expect(nftsResponse.result.account_nfts).toBeDefined();
        expect(nftsResponse.result.account_nfts.some((nft: any) => nft.URI === xrpl.convertStringToHex(nftUrl))).toBe(true);
    }, 50000);

    it('should fetch NFTs by address', async () => {
        const classicAddress = 'rG4LjchUEAMU6trvCVfacqrPvkra7ogtss';

        const result = await nftInstance.getTokensByAddress(classicAddress);

        expect(result).toBeDefined();
        expect(result).toHaveProperty('result');
        expect((result as AccountNFTsResponse).result.account_nfts).toBeDefined();
    });

    it("should mint NFT for Account and get account NFTs", async () => {
        const nftUrl = "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi";
        const accountAddress = 'rnXfoueFK2iZ2ub3d42ZKppk5oRWesbc7A';

        const { tx } = await nftInstance.mintNftForAccount(nftUrl, accountAddress);
        expect(tx).toBeDefined();
        
        if (typeof tx.result.meta === "object") {
            expect(tx.result.meta).toHaveProperty("TransactionResult");
            expect(tx.result.meta.TransactionResult).toBe("tesSUCCESS");
        } else {
            throw new Error("Unexpected meta format in TxResponse");
        }

        const nftsResponse = await nftInstance.getTokens();

        expect(nftsResponse).toBeDefined();

        expect(nftsResponse.result.account).toBe(accounts.coldWallet.classicAddress);
        expect(nftsResponse.result.account_nfts).toBeDefined();
        expect(nftsResponse.result.account_nfts.some((nft: any) => nft.URI === xrpl.convertStringToHex(nftUrl))).toBe(true);
    }, 100000);

    it('should fetch NFTs by address', async () => {
        const classicAddress = 'rnXfoueFK2iZ2ub3d42ZKppk5oRWesbc7A';

        const result = await nftInstance.getTokensByAddress(classicAddress);
    
        expect(result).toBeDefined();
        expect(result).toHaveProperty('result');
        expect((result as AccountNFTsResponse).result.account_nfts).toBeDefined();
      });
});