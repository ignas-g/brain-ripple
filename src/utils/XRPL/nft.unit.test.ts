import { NFT } from "./nft";
import { Core } from "./core";
import * as xrpl from "xrpl";
import { Client } from "xrpl";

jest.mock("xrpl");
jest.mock("./core");
jest.mock("./account", () => {
  const originalAccountModule = jest.requireActual("./account");
  return {
    ...originalAccountModule,
    Account: {
      ...originalAccountModule.Account,
      loadWallets: jest.fn().mockReturnValue({
        coldWallet: {
          classicAddress: "rJUhRwkA1ZQT75o82ApPf4pFGyEh8LNhv4",
        },
        hotWallet: {
          classicAddress: "r976iboq5rEuEwUdXdL2nftoDe4kfP4Fzt",
        },
      }),
    },
  };
});

const mockClient = ({
  submitAndWait: jest.fn(),
  request: jest.fn(),
  disconnect: jest.fn(),
} as unknown) as jest.Mocked<Client>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("NFT class", () => {
  it("should mint NFT successfully", async () => {
    const nft = new NFT();
    const nftUrl = "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi";

    (Core.getClient as jest.Mock).mockResolvedValue(mockClient);
    mockClient.submitAndWait.mockResolvedValue({} as xrpl.TxResponse);
    mockClient.request.mockResolvedValue({} as xrpl.AccountNFTsResponse);

    const result = await nft.mintNft(nftUrl);

    expect(Core.getClient).toHaveBeenCalled();

    expect(mockClient.submitAndWait).toHaveBeenCalledWith(
      expect.objectContaining({
        TransactionType: "NFTokenMint",
        URI: xrpl.convertStringToHex(nftUrl),
        Flags: 8,
        TransferFee: 1,
        NFTokenTaxon: 0,
      }),
      expect.anything()
    );
    
    expect(mockClient.request).toHaveBeenCalled();
    expect(mockClient.disconnect).toHaveBeenCalled();

    expect(result).toHaveProperty("tx");
    expect(result).toHaveProperty("nfts");
  });

  it("should get NFTs successfully", async () => {
    const nft = new NFT();

    (Core.getClient as jest.Mock).mockResolvedValue(mockClient);
    mockClient.request.mockResolvedValue({} as xrpl.AccountNFTsResponse);

    const result = await nft.getTokens();

    expect(Core.getClient).toHaveBeenCalled();
    expect(mockClient.request).toHaveBeenCalled();
    expect(mockClient.disconnect).toHaveBeenCalled();

    expect(result).toBeDefined();
  });
});
