
import Head from "next/head";
import Nft from "@/components/nft";
import styles from '@/styles/Nfts.module.css';
import {connectToDatabase} from "@/utils/mongodb";

type NFT = {
  id: string;
  creator:string
  mintedDate: Date;
  name: string;
  description: string;
  imageUrl: string;
  dataURL: string;
  s3FileName: string;
  nftMetadataCid:string;
  transactionId: string;
  nftId: string
};

export default function Nfts({ nfts }:{nfts:NFT[]}) {
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
          {nfts.map((nft, index) => (
            <Nft key={index} {...nft} />
          ))}
        </div>
      </main>
    </>
  );
}

export async function loadNfts() {
  const { db } = await connectToDatabase();
  const nfts = await db.collection('nfts').find().toArray();
  return nfts;
}

export async function getServerSideProps() {
  const nfts = await loadNfts();

  return {
    props: {
      nfts,
    },
  };
}
