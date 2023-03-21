export default function UploadAndMint() {
  return (<>
    <h1>Upload and Mint</h1>
    <p>You can upload your brainwave CSV files and mint an NFT out of them.</p>
    <p>Upload your CSV file and we will mint an NFT for you.</p>
    <form action="/api/upload" method="post" encType="multipart/form-data">
      <h2>File to upload</h2>
      <input type="file" id="file" name="file" accept=".csv"/>
      <h2>Thought description</h2>
      <input type="text" id="thought" name="thought" placeholder="Thought description"/>
      <button type="submit">Submit</button>
    </form>
  </>);
}