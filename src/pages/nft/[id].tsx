// pages/nft/[id].tsx
import { useRouter } from "next/router";
import Head from "next/head";
import Image from 'next/image';
import styles from "@/styles/ViewNft.module.css";
import BrainwaveChart from "@/components/brainwave";
import { random } from "@/utils/random";
import React from "react";
import {connectToDatabase} from "@/utils/mongodb";

// Add a placeholder function to fetch NFT data from the database
async function getNftById(nftId: string) {
  const { db } = await connectToDatabase();
  const nftsCollection = db.collection("nfts");

  const nftData = await nftsCollection.findOne({ nftId: nftId });

  if(!nftData) {
    return null;
  }

  // Convert nftData to a plain JavaScript object
  const nftDataObject = JSON.parse(JSON.stringify(nftData));

  // Remove non-serializable properties if needed, e.g., _id
  delete nftDataObject._id;

  return nftDataObject;
}

// Update getServerSideProps to fetch NFT data
export async function getServerSideProps(context: any) {
  const { id } = context.params;
  const nftData = await getNftById(id);
  return {
    props: {
      nftData,
    },
  };
}


function generateBrainwaveSeriesData(seriesCount:number, points: number) {
  const data = [];

  for (let i = 0; i < points; i++) {
    const time = i;
    for (let j = 0; j < seriesCount; j++) {
      const value = random() * 100;
      data.push({ time, value, series: `Series ${j + 1}` });
    }
  }

  return data;
}

const ViewNft = ({ nftData }: { nftData: any }) => {
  const router = useRouter();
  const { id } = router.query;

  if(!nftData) {
    return (<main className={styles.container}>
      <div>NFT not found</div>
    </main>);
  }

  const brSeriesData = generateBrainwaveSeriesData(16, 100);

  return (
    <>
      <Head>
        <meta
          name="description"
          content={`View the details of the NFT with ID ${id}`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.container}>
        <h1 className={styles.heading}>NFT Details</h1>
        <div className={styles.nftInfo}>
          <p className={styles.paragraph}>
            <strong>NFT ID:</strong> {nftData.nftId}
          </p>
          <p className={styles.paragraph}>
            <Image src={nftData.imageUrl} alt={'NFT image'} width={100} height={100}/>
          </p>
          <p className={styles.paragraph}>
            <strong>Creator:</strong> {nftData.creator}
          </p>
          <p className={styles.paragraph}>
            <strong>Minted Date:</strong> {new Date(nftData.mintedDate).toISOString()}
          </p>
          <p className={styles.paragraph}>
            <strong>Name:</strong> {nftData.name}
          </p>
          <p className={styles.paragraph}>
            <strong>Description:</strong> {nftData.description}
          </p>

          <p className={styles.paragraph}>
            <strong>Data URL:</strong> {nftData.dataURL}
          </p>
          <p className={styles.paragraph}>
            <strong>S3 File Name:</strong> {nftData.s3FileName}
          </p>
          <p className={styles.paragraph}>
            <strong>NFT Metadata CID:</strong> {nftData.nftMetadataCid}
          </p>

          <p className={styles.paragraph}>
            <strong>Transaction ID:</strong> {nftData.transactionId}
          </p>
        </div>

        {/* Commented out to focus on displaying the NFT properties
    <div>
      <BrainwaveFrequencyChart data={frData}></BrainwaveFrequencyChart>
    </div>
    */}


    <div>
      <BrainwaveChart data={brSeriesData}></BrainwaveChart>
    </div>


      </main>
    </>
  );
};

export default ViewNft;