import {getEnvValue, mintNft} from "./xrpl";
import * as xrpl from "xrpl";
jest.mock("xrpl");

describe("test mintNft function", () => {
    it("should mint an NFT", async () => {
        const nftId = "123";
        const nftUrl = "https://example.com";
        xrpl.Client.prototype.connect = jest.fn();
        xrpl.Client.prototype.submit = jest.fn();
        xrpl.Client.prototype.disconnect = jest.fn();
        xrpl.Client.prototype.submitAndWait = jest.fn().mockResolvedValue({});
        xrpl.Client.prototype.request = jest.fn().mockResolvedValue({});

        const getEnvValueMock = jest.fn();
        getEnvValueMock.mockReturnValue("seed");

        // @ts-ignore
        getEnvValue = getEnvValueMock;


        const deriveKeypairMock = jest.fn();
        deriveKeypairMock.mockReturnValue({
            publicKey: "publicKey",
        });
        // @ts-ignore
        xrpl.deriveKeypair= deriveKeypairMock;


        const response = await mintNft(nftId, nftUrl);
        expect(response).not.toBeNull();
        expect(response).toEqual({ tx:{}, nfts:{}});
    });
});