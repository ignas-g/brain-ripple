import { SdkTypes, XummSdk } from "xumm-sdk";
import config from "../../config";

// The following class contains XummSdk related operations.
// Users are able to create a sign-in request for the XUMM Wallet.
// The payload data can be resolved by calling the resolvePayload method.
export class Xumm {
  private xummSdk: XummSdk;

  constructor() {
    const apiKey = config.xumm_api_key;
    const apiSecret = config.xumm_api_secret;
    
    this.xummSdk = new XummSdk(apiKey, apiSecret);
  }

  // Users are able to create a sign-in request for the XUMM Wallet.
  async generateSignRequest(message: string) {
    const payload: SdkTypes.XummPostPayloadBodyJson = {
      txjson: {
        TransactionType: "SignIn",
        Memos: [
          {
            Memo: {
              MemoType: Buffer.from("client_signature", "utf8").toString("hex"),
              MemoData: Buffer.from(message, "utf8").toString("hex"),
            },
          },
        ],
      },
      options: {
        submit: false,
      },
    };
  
    try {
      const response = await this.xummSdk.payload.create(payload);
      return response;
    } catch (error) {
      console.error("Error generating XUMM sign request:", error);
      throw error;
    }
  }
  
  // The payload data can be resolved by calling the resolvePayload method.
  async resolvePayload(payload: SdkTypes.XummPostPayloadResponse) {
    try {
      const response = await this.xummSdk.payload.resolvePayload(payload)
      return response;
    } catch (error) {
      console.error("Error resolving XUMM payload:", error);
      throw error;
    }
  }
}
