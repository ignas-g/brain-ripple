// UploadAndMint.js
import styles from '@/styles/UploadAndMint.module.css';

export default function UploadAndMint() {
  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.heading}>Upload and Mint</h1>
        <p className={styles.paragraph}>
          You can upload your brainwave CSV files and mint an NFT out of them.
        </p>
        <p className={styles.paragraph}>Upload your CSV file and we will mint an NFT for you.</p>
        <form
          className={styles.form}
          action="/api/upload"
          method="post"
          encType="multipart/form-data"
        >
          <h2 className={styles.heading}>File to upload</h2>
          <input
            className={styles.fileInput}
            type="file"
            id="file"
            name="file"
            accept=".csv"
          />
          <h2 className={styles.heading}>Thought description</h2>
          <input
            className={styles.textInput}
            type="text"
            id="thought"
            name="thought"
            placeholder="Thought description"
          />
          <button className={styles.submitButton} type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}
