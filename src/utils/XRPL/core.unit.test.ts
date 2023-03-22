import { Core } from "./core";
import * as xrpl from "xrpl";
import config from "../../../config";

jest.mock("xrpl");
jest.mock("../../../config");

const mockedXrpl = jest.requireMock("xrpl");

describe("Core", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getNetwork", () => {
    it("should return the correct network URL based on the configuration", () => {
      (config.network as any) = "testnet";
      const network = Core.getNetwork();

      expect(network).toBe(Core.networks.testnet);
    });

    it("should throw an error if the configured network is invalid", () => {
      (config.network as any) = "invalidNetwork";

      expect(() => Core.getNetwork()).toThrow("Invalid network");
    });
  });

  describe("getClient", () => {
    it("should return a connected client for the configured network", async () => {
      (config.network as any) = "testnet";
      const mockClient = new xrpl.Client(Core.networks.testnet);
      mockClient.connect = jest.fn().mockResolvedValue(undefined);
      mockClient.isConnected = jest.fn().mockReturnValue(true); // Mock isConnected method directly
      mockedXrpl.Client.mockReturnValue(mockClient);
  
      const client = await Core.getClient();
  
      expect(client).toBeInstanceOf(xrpl.Client);
      expect(client.isConnected()).toBeTruthy();
      
      expect(mockClient.connect).toHaveBeenCalledTimes(1);
      expect(mockedXrpl.Client).toHaveBeenCalledWith(Core.networks.testnet);
    });
  });  
});
