import * as xrpl from "xrpl";
const network:string = "testnet";

const getNetwork = () => {
    switch (network) {
        case "mainnet":
            return "wss://s1.ripple.com";
        case "testnet":
            return "wss://s.altnet.rippletest.net:51233";
        case "devnet":
            return "wss://s.devnet.rippletest.net:51233";
        default:
            throw new Error("Invalid network");
    }
}

const getClient = () => {
    const network = getNetwork();
    const client = new xrpl.Client(network)
    return client;
}

export const getEnvValue = (key:string) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`${key} not set`);
    }
    return value;
}

const getWalletCold = () => {
    const wallet = xrpl.deriveKeypair(getEnvValue("XRPL_SEED_COLD"));
    return wallet;
}

const getWalletHot = () => {
    const wallet = xrpl.deriveKeypair(getEnvValue("XRPL_SEED_HOT"));
    return wallet;
}

const getBalance = async () => {
    const client = getClient();
    const wallet = getWalletCold();
    const balance = await client.getXrpBalance(wallet.publicKey);
    return balance;
}

export const mintNft = async (nftId:string, nftUrl: string) => {
    const client = getClient();
    await client.connect()
    const walletCold = getWalletCold();
    const walletHot = getWalletHot();

    const transactionBlob = {
        "TransactionType": "NFTokenMint",
        "Account": walletCold.publicKey,
        "URI": xrpl.convertStringToHex(nftUrl),

        "Flags": 8,

        "TransferFee": 1,

        "NFTokenTaxon": 0 //Required, but if you have no use for it, set to zero.
    }

    const tx = await client.submitAndWait(transactionBlob as any, { wallet: walletCold} as any );


    const nfts = await client.request({
        method: "account_nfts",
        account: walletCold.publicKey
    } as any);


    client.disconnect()
    return { tx, nfts };
}
