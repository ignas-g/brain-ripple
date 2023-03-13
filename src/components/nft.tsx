import Grid from "@mui/system/Unstable_Grid";

export type NftProps = {
    owner: string,
    mintedDate: Date

}

export default function Nft(props:NftProps) {
    return (
        <>
            <Grid container>
                <Grid xs={6}>
                    Owner:
                </Grid>
                <Grid xs={6}>
                    {props.owner}
                </Grid>
                <Grid xs={6}>
                    Minted:
                </Grid>
                <Grid xs={6}>
                    {props.mintedDate.toISOString()}
                </Grid>
            </Grid>
        </>
    )
}
