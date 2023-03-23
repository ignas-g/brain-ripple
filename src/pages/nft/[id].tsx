// pages/nft/[id].tsx
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "@/styles/ViewNft.module.css";

const ViewNft = () => {
  const router = useRouter();
  const { id } = router.query;

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
            <strong>ID:</strong> {id}
          </p>
          {/* Add other NFT properties here */}
        </div>
      </main>
    </>
  );
};

export default ViewNft;
