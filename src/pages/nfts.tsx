// Nfts.tsx
import Head from "next/head";
import Nft from "@/components/nft";
import styles from '@/styles/Nfts.module.css';

export default function Nfts() {
  return (
    <>
      <Head>
        <title>Tokenize your thoughts!</title>
        <meta name="description" content="Tokenize your thoughts!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <h1 className={styles.heading}>Tokenize your thoughts!</h1>
        <p className={styles.paragraph}>Here are all the NFTs minted:</p>
        <div className={styles.nftList}>
          <Nft owner="0x1234" mintedDate={new Date()} />
          <Nft owner="0x1234" mintedDate={new Date()} />
          <Nft owner="0x1234" mintedDate={new Date()} />
          <Nft owner="0x1234" mintedDate={new Date()} />
        </div>
      </main>
    </>
  );
}
