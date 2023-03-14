import Head from "next/head";
import Nft from "@/components/nft";

export default function Nfts() {
    return (
        <>
            <Head>
                <title>Tokenize your thoughts!</title>
                <meta name="description" content="Tokenize your thoughts!" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <h1>Tokenize your thoughts!</h1>
                <p>Here are all the NFTs minted:</p>
                <Nft owner="0x1234" mintedDate={new Date()} />
                <Nft owner="0x1234" mintedDate={new Date()} />
                <Nft owner="0x1234" mintedDate={new Date()} />
                <Nft owner="0x1234" mintedDate={new Date()} />
            </main>
        </>
    )
}
