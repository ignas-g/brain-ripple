import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@mui/material";
import styles from "@/styles/Login.module.css";
import axios from "axios";
import { SdkTypes } from "xumm-sdk";

async function requestXummSignin(): Promise<SdkTypes.XummPostPayloadResponse | null> {
  const response = await axios.post("/api/xumm/signin");
  
  const data: SdkTypes.XummPostPayloadResponse = response.data;
  
  if (data && data.next.always) {
    return data;
  }

  return null;
}

export default function Login() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const handleLogin = async () => {
    const data = await requestXummSignin();

    if (data) {
      setQrCodeUrl(data.refs.qr_png);

      const socket = new WebSocket(data.refs.websocket_status);
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
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
      };
    }
  };

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

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.column}>
          <Button
            className={styles.loginButton}
            variant="contained"
            color="primary"
            onClick={handleLogin}
          >
            Login with XRPL Wallet
          </Button>
        </div>
        <div className={styles.column}>
          {qrCodeUrl && (
            <Image
              src={qrCodeUrl}
              alt="QR Code"
              width={200}
              height={200}
              unoptimized={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}
