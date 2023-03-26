import Grid from "@mui/system/Unstable_Grid";
import Link from "next/link";

export type NftProps = {
  id: string;
  creator: string;
  mintedDate: Date;
  name: string;
  description: string;
  imageUrl: string;
  dataURL: string;
  s3FileName: string;
  nftMetadataCid: string;
  transactionId: string;
  nftId: string;
};

export default function Nft(props: NftProps) {
  return (
    <>
      <Link href={`/nft/${props.id}`}>
        <Grid container spacing={2}>
          <Grid xs={12}>
            <h2>{props.name}</h2>
          </Grid>
          <Grid xs={6}>
            Creator:
          </Grid>
          <Grid xs={6}>
            {props.creator}
          </Grid>
          <Grid xs={6}>
            Minted:
          </Grid>
          <Grid xs={6}>
            {props.mintedDate.toISOString()}
          </Grid>
          <Grid xs={6}>
            NFT ID:
          </Grid>
          <Grid xs={6}>
            {props.nftId}
          </Grid>
          <Grid xs={6}>
            Transaction ID:
          </Grid>
          <Grid xs={6}>
            {props.transactionId}
          </Grid>
          <Grid xs={6}>
            Metadata CID:
          </Grid>
          <Grid xs={6}>
            {props.nftMetadataCid}
          </Grid>
          <Grid xs={12}>
            <p>{props.description}</p>
          </Grid>
          <Grid xs={12}>
            <img src={props.imageUrl} alt={props.name} style={{maxWidth: "100%"}}/>
          </Grid>
        </Grid>
      </Link>
    </>
  );
}
