import { Account, IBalance } from "./account";
import { Wallet } from "xrpl";
import config from "../../../config";

jest.mock("xrpl");
jest.mock("./core");

const mockedCore = jest.requireMock("./core");

describe("Account class", () => {
  let walletCold: Wallet;
  let walletHot: Wallet;

  beforeEach(() => {
    walletCold = new Wallet(config.xrpl_publickey_cold, config.xrpl_privatekey_cold, { masterAddress: config.xrpl_address_cold });
    walletHot = new Wallet(config.xrpl_publickey_hot, config.xrpl_privatekey_hot, { masterAddress: config.xrpl_address_hot });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getBalance", () => {
    it("should get the XRP balance of the cold wallet", async () => {
      const account = new Account(walletCold, walletHot);
      const mockBalance = "1000";

      const mockClient = {
        getXrpBalance: jest.fn().mockResolvedValue(mockBalance),
        connect: jest.fn(),
      };

      mockedCore.Core.getClient.mockResolvedValue(mockClient);

      const balance = await account.getBalance();
      const expectedBalance: IBalance = { value: mockBalance, currency: "XRP" };

      expect(balance).toEqual(expectedBalance);
      expect(mockedCore.Core.getClient).toHaveBeenCalledTimes(1);
    });

    it("should return an error message if there's an error fetching the balance", async () => {
      const account = new Account(walletCold, walletHot);

      const mockClient = {
        getXrpBalance: jest.fn().mockRejectedValue(new Error("Error fetching balance")),
        connect: jest.fn(),
      };

      mockedCore.Core.getClient.mockResolvedValue(mockClient);

      const balance = await account.getBalance();
      const expectedErrorMessage = "Error fetching balance.";

      expect(balance).toEqual(expectedErrorMessage);
      expect(mockedCore.Core.getClient).toHaveBeenCalledTimes(1);
    });
  });

  describe("loadWallets", () => {
    it("should create an Account object from environment variables", () => {
      Wallet.fromSeed = jest.fn()
        .mockReturnValueOnce(walletCold)
        .mockReturnValueOnce(walletHot);

      const account = Account.loadWallets();

      expect(account).toBeInstanceOf(Account);
      expect(account.coldWallet).toEqual(walletCold);
      expect(account.hotWallet).toEqual(walletHot);

      expect(Wallet.fromSeed).toHaveBeenCalledTimes(2);
      expect(Wallet.fromSeed).toHaveBeenNthCalledWith(1, config.xrpl_seed_cold);
      expect(Wallet.fromSeed).toHaveBeenNthCalledWith(2, config.xrpl_seed_hot);
    });

    it("should throw an error if it fails to create an Account object from environment variables", () => {
      Wallet.fromSeed = jest.fn().mockImplementation(() => {
        throw new Error("Failed to create wallet");
      });

      expect(() => Account.loadWallets()).toThrow("Failed to create Account from environment variables");
    });
  });
});
