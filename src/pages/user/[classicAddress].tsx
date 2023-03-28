import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Nft, { NftProps } from "@/components/nft";
import styles from "@/styles/Nfts.module.css";
import axios from "axios";
import { NftApiResponseData, NftApiErrorResponseData } from '../api/nfts';
import * as xrpl from "xrpl";

export default function UserNfts() {
  const router = useRouter();
  const { classicAddress } = router.query;
  const [nfts, setNfts] = useState<NftProps[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNfts = async () => {
      try {
        const response = await axios.get<NftApiResponseData | NftApiErrorResponseData>(`/api/nfts?classicAddress=${classicAddress}`);

        if ("nfts" in response.data) {
          const nfts = response.data.nfts.map((nft) => ({
            id: nft.NFTokenID,
            creator: nft.Issuer,
            imageUrl: xrpl.convertHexToString(nft.URI!),
            nftId: nft.NFTokenID,
          }));
          setNfts(nfts);
        } else {
          setError(response.data.error);
        }
      } catch (error) {
        console.error(error);
        setError("An unexpected error occurred while fetching NFTs");
      }
    };

    if (typeof classicAddress === "string") {
      fetchNfts();
    }
  }, [classicAddress]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Head>
        <title>User NFTs</title>
        <meta name="description" content="A list of NFTs owned by a user." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <h1 className={styles.heading}>User NFTs</h1>
        <p className={styles.paragraph}>Here are all the NFTs owned by the user:</p>
        <div className={styles.nftList}>
          {nfts.map((nft) => (
            <Nft key={nft.id} {...nft} />
          ))}
        </div>
      </main>
    </>
  );
}
