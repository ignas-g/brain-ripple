import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '@/styles/UploadAndMint.module.css';

type UploadState = 'idle' | 'in_progress' | 'success' | 'error';

export default function UploadAndMint() {
  const [file, setFile] = useState<File | null>(null);
  const [thought, setThought] = useState<string>('');
  const [ownerAddress, setOwnerAddress] = useState<string>('');
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      setFile(fileList[0]);
    }
  };

  const handleThoughtChange = (e: ChangeEvent<HTMLInputElement>) => {
    setThought(e.target.value);
  };

  const handleOwnerAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOwnerAddress(e.target.value);
  };

  const isValidRippleAddress = (address: string) => {
    const rippleAddressRegex = /^r[1-9A-HJ-NP-Za-km-z]{25,34}$/;
    return rippleAddressRegex.test(address);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      console.error('No file selected');
      return;
    }

    if (!isValidRippleAddress(ownerAddress)) {
      setErrorMessage('Invalid Ripple address. Please provide a valid address.');
      return;
    }

    setUploadState('in_progress');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('thought', thought);
    formData.append('ownerAddress', ownerAddress);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload success:', response);

      // extract nftId from response
      const nftId = response.data.nftId;
      setUploadState('success');
      //TODO: Navigate to the NFT page by id
      router.push(`/nft/${nftId}`); // Navigate to the "view-nft" page
    } catch (error) {
      console.error('Upload error:', error);
      setUploadState('error');
      setErrorMessage('Upload failed. Please try again.');
    }
  };

  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.heading}>Upload and Mint</h1>
        <p className={styles.paragraph}>
          You can upload your brainwave CSV files and mint an NFT out of them.
        </p>
        <p className={styles.paragraph}>Upload your CSV file and we will mint an NFT for you.</p>
        {uploadState === 'in_progress' && <p>Uploading and minting in progress...</p>}
        {uploadState === 'error' && <p className={styles.error}>{errorMessage}</p>}
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2 className={styles.heading}>File to upload</h2>
          <input
            className={styles.fileInput}
            type="file"
            id="file"
            name="file"
            accept=".csv"
            onChange={handleFileChange}
          />
          <h2 className={styles.heading}>Thought description</h2>
          <input
            className={styles.textInput}
            type="text"
            id="thought"
            name="thought"
            placeholder="Thought description"
            value={thought}
            onChange={handleThoughtChange}
          />
          <h2 className={styles.heading}>Creator Ripple address</h2>
          <input
            className={styles.textInput}
            type="text"
            id="ownerAddress"
            name="ownerAddress"
            placeholder="Owner Ripple address"
            value={ownerAddress}
            onChange={handleOwnerAddressChange}
          />
          <button className={styles.submitButton} type="submit" disabled={uploadState === 'in_progress'}>
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

