import * as xrpl from "xrpl";
import { Core } from "./core";
import config from "../../../config";
import { Wallet } from "xrpl";

export interface IBalance {
    value: string;
    currency: string;
}

// XRPL Account Management Functions
// Enables wallet loading and balance retrieval for user accounts
export class Account {
    private readonly walletCold: Wallet;
    private readonly walletHot: Wallet;

    constructor(walletCold: Wallet, walletHot: Wallet) {
        this.walletCold = walletCold;
        this.walletHot = walletHot;
    }

    get coldWallet(): Wallet {
        return this.walletCold;
    }

    get hotWallet(): Wallet {
        return this.walletHot;
    }

    /**
     * Gets the XRP balance of the cold wallet.
     *
     * @returns A promise that resolves to the balance as an IBalance object, or an error message on failure.
     */
    public async getBalance(): Promise<IBalance | string> {
        let client;

        try {
            client = await Core.getClient();
            const balance = await client.getXrpBalance(this.walletCold.address);

            await client.disconnect();
            return { value: balance, currency: "XRP" };
        } catch (error) {
            console.error("Error fetching balance:", error);
            return "Error fetching balance.";
        } finally {
            if (client?.isConnected()) {
                await client.disconnect();
            }
        }
    }

    /**
     * Creates an Account object from the environment variables.
     *
     * @returns An Account object with the cold and hot wallets initialized from the environment variables.
     *          Throws an error on failure.
     */
    public static loadWallets(): Account {
        try {
            const walletCold = xrpl.Wallet.fromSeed(config.xrpl_seed_cold);
            const walletHot = xrpl.Wallet.fromSeed(config.xrpl_seed_hot);

            return new Account(walletCold, walletHot);
        } catch (error: any) {
            throw new Error(`Failed to create Account from environment variables: ${error.message}`);
        }
    }
}
