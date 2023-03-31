import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Nft, { NftProps } from "@/components/nft";
import styles from "@/styles/Nfts.module.css";
import axios from "axios";
import { NftApiResponseData, NftApiErrorResponseData } from '../api/nfts';
import * as xrpl from "xrpl";
import { Button } from "@mui/material";
import { SdkTypes } from "xumm-sdk";
import Image from "next/image";

async function requestXummAuthorize(accountAddress: string): Promise<SdkTypes.XummPostPayloadResponse | null> {
  const response = await axios.post("/api/xumm/authorize", accountAddress,
    {
      headers: { "Content-Type": "text/plain" }
    });

  const data: SdkTypes.XummPostPayloadResponse = response.data;

  if (data && data.next.always) {
    return data;
  }

  return null;
}

async function requestXummUnauthorize(accountAddress: string): Promise<SdkTypes.XummPostPayloadResponse | null> {
  const response = await axios.post("/api/xumm/unauthorize", accountAddress,
    {
      headers: { "Content-Type": "text/plain" }
    });

  const data: SdkTypes.XummPostPayloadResponse = response.data;

  if (data && data.next.always) {
    return data;
  }

  return null;
}

export default function UserNfts() {
  const router = useRouter();
  const { classicAddress } = router.query;
  const [nfts, setNfts] = useState<NftProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (socket) {
        socket.close();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [socket]);

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

  const resolvePayload= async (url: string, data: SdkTypes.XummPostPayloadResponse) => {
    const socket = new WebSocket(url);
      setSocket(socket);

      socket.onmessage = (event) => {
        const payload = JSON.parse(event.data);

        if (payload.payload_uuidv4 && payload.signed) {
          axios
            .post(`/api/xumm/resolve`, data)
            .then((response) => response.data)
            .then((data) => {
              if (data && data.response && data.response.account) {
                //TODO: User wallet address can be used in other flows.
                console.log(data.response.account);
                
                socket.close();
                setQrCodeUrl(null);
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
      };
  }

  const handleAuthorize = async () => {
    const data = await requestXummAuthorize(classicAddress!.toString());

    if (data) {
      setQrCodeUrl(data.refs.qr_png);

      resolvePayload(data.refs.websocket_status, data);
    }
  };

  const handleUnauthorize = async () => {
    const data = await requestXummUnauthorize(classicAddress!.toString());

    if (data) {
      setQrCodeUrl(data.refs.qr_png);

      resolvePayload(data.refs.websocket_status, data);
    }
  };

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
        <div className={styles.row}>
          <div className={styles.column}>
            <Button
              className={styles.loginButton}
              variant="contained"
              color="primary"
              onClick={handleAuthorize}
            >
              Authorize For NFT Minting
            </Button>
          </div>
          <br />
          <div className={styles.column}>
            <Button
              className={styles.loginButton}
              variant="contained"
              color="primary"
              onClick={handleUnauthorize}
            >
              Unauthorize For NFT Minting
            </Button>
          </div>
          {qrCodeUrl && (
            <div className={styles.column}>
              <br />
              <Image
                src={qrCodeUrl}
                alt="QR Code"
                width={200}
                height={200}
                unoptimized={true}
              />
            </div>
          )}
        </div>
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
