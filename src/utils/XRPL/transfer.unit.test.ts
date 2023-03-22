import { Transfer } from "./transfer";
import * as keypairs from "xrpl-keypairs";
import axios from "axios";

const transfer = new Transfer();

async function fundTestnetAccount(address: string): Promise<void> {
  const faucetUrl = "https://faucet.altnet.rippletest.net/accounts";
  const response = await axios.post(faucetUrl, { "destination": address, "memos": [{ "data": "xrpl.org-faucet" }] });

  if (response.status !== 200 || response.data.amount !== 1000) {
    throw new Error("Failed to fund testnet account");
  }
}

describe("Transfer class", () => {
  let senderSeed: string;
  let senderAddress: string;
  let recipientSeed: string;
  let recipientAddress: string;

  beforeAll(() => {
    senderSeed = keypairs.generateSeed({ algorithm: "ecdsa-secp256k1" });
    senderAddress = keypairs.deriveAddress(keypairs.deriveKeypair(senderSeed).publicKey);
    recipientSeed = keypairs.generateSeed({ algorithm: "ecdsa-secp256k1" });
    recipientAddress = keypairs.deriveAddress(keypairs.deriveKeypair(recipientSeed).publicKey);
  });

  it("should transfer XRP successfully", async () => {
    const amount = "10";

    // Fund the sender's account before transferring
    await fundTestnetAccount(senderAddress);

    const txHash = await transfer.transferXRP(senderSeed, recipientAddress, amount);

    expect(txHash).toBeTruthy();
  }, 10000);

  it("should throw an error with an invalid sender seed", async () => {
    const invalidSenderSeed = "invalidSeed";
    const amount = "10";

    await expect(
      transfer.transferXRP(invalidSenderSeed, recipientAddress, amount)
    ).rejects.toThrow("Error in transferXRP: Non-base58 character");
  });

  it("should throw an error with an invalid recipient address", async () => {
    const invalidRecipientAddress = "invalidAddress";
    const amount = "10";

    // Fund the sender's account before transferring
    await fundTestnetAccount(senderAddress);

    await expect(
      transfer.transferXRP(senderSeed, invalidRecipientAddress, amount)
    ).rejects.toThrow("Error in transferXRP: Non-base58 character");
  });

  it("should throw an error with insufficient balance", async () => {
    const amount = "1000000000000000"; // An unreasonably high amount

    // Fund the sender's account before transferring
    await fundTestnetAccount(senderAddress);

    await expect(
      transfer.transferXRP(senderSeed, recipientAddress, amount)
    ).rejects.toThrow("Error in transferXRP: 1000000000000000000000 is an illegal amount");
  }, 10000);
});
