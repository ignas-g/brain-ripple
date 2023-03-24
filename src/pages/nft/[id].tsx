// pages/nft/[id].tsx
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "@/styles/ViewNft.module.css";
import BrainwaveFrequencyChart from "@/components/brain-frequencies";
import BrainwaveChart from "@/components/brainwave";
import {random} from "@/utils/random";

function generateFrequencyData() {
  //set random seed
  const brainwaveTypes = [
    "Delta",
    "Theta",
    "Alpha",
    "Beta",
    "Gamma",
  ];

  return brainwaveTypes.map((type) => ({
    type,
    frequency: random() * 100,
  }));
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

//generate server side props
export async function getServerSideProps() {
  const frData = generateFrequencyData();
  const brSeriesData = generateBrainwaveSeriesData(16, 100);
  return {
    props: {
      frData,
      brSeriesData
    }
  }
}

const ViewNft = ({frData, brSeriesData}:{frData:any, brSeriesData:any}) => {
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
        <div>
          <BrainwaveFrequencyChart data={frData}></BrainwaveFrequencyChart>
        </div>
        <div>
          <BrainwaveChart data={brSeriesData}></BrainwaveChart>
        </div>
      </main>
    </>
  );
};

export default ViewNft;
