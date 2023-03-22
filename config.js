const dotenv = require('dotenv');
const Joi = require('joi');

dotenv.config();

const envSchema = Joi.object({
    NETWORK: Joi.string().valid("mainnet", "testnet", "devnet").default("testnet").required(),
    XRPL_SEED_COLD: Joi.string().required(),
    XRPL_PUBLICKEY_COLD: Joi.string().required(),
    XRPL_PRIVATEKEY_COLD: Joi.string().required(),
    XRPL_ADDRESS_COLD: Joi.string().required(),
    XRPL_SEED_HOT: Joi.string().required(),
    XRPL_PUBLICKEY_HOT: Joi.string().required(),
    XRPL_PRIVATEKEY_HOT: Joi.string().required(),
    XRPL_ADDRESS_HOT: Joi.string().required(),
}).unknown().required();

const { error, value: envVars } = envSchema.prefs({ errors: { label: "key" } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const config = {
    network: envVars.NETWORK,
    xrpl_seed_cold: envVars.XRPL_SEED_COLD,
    xrpl_publickey_cold: envVars.XRPL_PUBLICKEY_COLD,
    xrpl_privatekey_cold: envVars.XRPL_PRIVATEKEY_COLD,
    xrpl_address_cold: envVars.XRPL_ADDRESS_COLD,
    xrpl_seed_hot: envVars.XRPL_SEED_HOT,
    xrpl_publickey_hot: envVars.XRPL_PUBLICKEY_HOT,
    xrpl_privatekey_hot: envVars.XRPL_PRIVATEKEY_HOT,
    xrpl_address_hot: envVars.XRPL_ADDRESS_HOT,
};

module.exports = config;