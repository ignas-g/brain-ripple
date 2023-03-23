import * as xrpl from "xrpl";
import config from "../../../config";

// XRPL Core Library Functions
// Retrieve network URLs, create clients, and establish connections with the network
export class Core {
  static networks = {
    mainnet: "wss://s1.ripple.com",
    testnet: "wss://s.altnet.rippletest.net:51233",
    devnet: "wss://s.devnet.rippletest.net:51233",
  };

  static getNetwork(): string {
    if (!(config.network in this.networks)) {
      throw new Error("Invalid network");
    }

    return this.networks[config.network];
  }

  static async getClient(): Promise<xrpl.Client> {
    const network = this.getNetwork();
    const client = new xrpl.Client(network);
    await client.connect();

    return client;
  }
}
