import * as xrpl from "xrpl";
import { Core } from "./core";

export class Transfer {
  async transferXRP(
    senderSeed: string,
    recipientAddress: string,
    amount: string
  ): Promise<string> {
    let client;
    
    try {
      client = await Core.getClient();

      const senderWallet = xrpl.Wallet.fromSeed(senderSeed);

      const preparedTx = await client.autofill({
        TransactionType: "Payment",
        Account: senderWallet.address,
        Destination: recipientAddress,
        Amount: xrpl.xrpToDrops(amount),
      });

      const signedTx = senderWallet.sign(preparedTx);

      const submitResult = await client.submitAndWait(signedTx.tx_blob);

      const txHash = submitResult.result.hash;
      console.log(`Transaction hash: ${txHash}`);

      await client.disconnect();

      return txHash;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error in transferXRP: ${error.message}`);
      } else {
        throw new Error("An unexpected error occurred in transferXRP.");
      }
    } finally {
      if (client?.isConnected()) {
        await client.disconnect();
      }
    }
  }
}
