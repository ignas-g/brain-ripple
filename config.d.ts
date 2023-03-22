declare const config: {
    network: "mainnet" | "testnet" | "devnet";
    xrpl_seed_cold: string;
    xrpl_publickey_cold: string;
    xrpl_privatekey_cold: string;
    xrpl_address_cold: string;
    xrpl_seed_hot: string;
    xrpl_publickey_hot: string;
    xrpl_privatekey_hot: string;
    xrpl_address_hot: string;
};

export default config;
