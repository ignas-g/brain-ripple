const config = require("./config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NETWORK: config.network,
    XRPL_SEED_COLD: config.xrpl_seed_cold,
    XRPL_PULICKEY_COLD: config.xrpl_publickey_cold,
    XRPL_PRIVATEKEY_COLD: config.xrpl_privatekey_cold,
    XRPL_ADDRESS_COLD: config.xrpl_address_cold,
    XRPL_SEED_HOT: config.xrpl_seed_hot,
    XRPL_PULICKEY_HOT: config.xrpl_publickey_hot,
    XRPL_PRIVATEKEY_HOT: config.xrpl_privatekey_hot,
    XRPL_ADDRESS_HOT: config.xrpl_address_hot,
    MONGODB_BC_URI: config.MONGODB_BC_URI,
    MONGODB_BC_DB: config.MONGODB_BC_DB,
    XUMM_API_KEY: config.XUMM_API_KEY,
    XUMM_API_SECRET: config.XUMM_API_SECRET,
  },
}

module.exports = nextConfig
