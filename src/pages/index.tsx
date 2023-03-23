// Home.js
import Head from 'next/head';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import { Button, Card, CardContent, Typography } from '@mui/material';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Tokenize your thoughts!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.mainContainer}>
        <Card className={styles.cardContainer} sx={{ maxWidth: 500 }}>
          <CardContent className={styles.cardContent}>
            <Image
              className={styles.logo}
              src={'/logo.png'}
              alt={'Logo'}
              width={200}
              height={200}
            />
            <Typography variant="h4" component="h1" gutterBottom>
              Mint your thoughts into an NFT
            </Typography>
            <Typography variant="body1" component="p" gutterBottom>
              Upload your thoughts and mint them into NFTs. Claim ownership and sell to others.
            </Typography>
            <Typography variant="body1" component="p" gutterBottom>
              Build a model that can recognize thoughts and control your computer without using your hands.
            </Typography>
            <Button
              className={styles.mintButton}
              variant="contained"
              color="primary"
              href={'/upload-and-mint'}
            >
              Mint Now
            </Button>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
