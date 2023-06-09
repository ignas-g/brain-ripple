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
    MONGODB_BC_URI: Joi.string().required(),
    MONGODB_BC_DB: Joi.string().required(),
    AWS_ACCESS_KEY_ID: Joi.string().required(),
    AWS_SECRET_ACCESS_KEY: Joi.string().required(),
    AWS_REGION: Joi.string().required(),
    AWS_S3_BUCKET_NAME: Joi.string().required(),
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
    mongo_db_bc_uri: envVars.MONGODB_BC_URI,
    mongo_db_bc_db: envVars.MONGODB_BC_DB,
    AWS_ACCESS_KEY_ID: envVars.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: envVars.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: envVars.AWS_REGION,
    AWS_S3_BUCKET_NAME: envVars.AWS_S3_BUCKET_NAME,
};

module.exports = config;