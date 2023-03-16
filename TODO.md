# TODO tasks for the project

## Tasks for a Fullstack Next.js Developer:
Set up the Next.js project structure with the required dependencies
Develop the frontend user interface, including pages for recording thoughts, uploading files, and minting NFTs
Implement user authentication and authorization
Create API endpoints to communicate with the backend services, such as XRPL blockchain integration and machine learning services
Integrate uploading of brainwaves and handling the recorded data
Optimize the application for performance, accessibility, and SEO
Write unit and integration tests for the developed components and API endpoints
Set up CI/CD pipelines for automated deployment and testing
Collaborate with the XRPL blockchain developer and the DSP/AI developer to ensure seamless integration

## Tasks for an XRPL Blockchain Developer:
Research and choose the appropriate XRPL libraries and tools for the project (xrpl is provided)
Develop backend for minting and managing NFTs on the XRPL blockchain (see src/utils/xrpl.ts), add unit tests
Implement functions for creating, transferring, and querying NFT ownership
Develop a payment system for handling SaaS subscription fees using the XRPL blockchain
Write unit and integration tests for the developed smart contracts and functions
Collaborate with the Fullstack Next.js developer to integrate the blockchain functions into the web application
Monitor and optimize the performance, security, and cost-efficiency of the XRPL integration

## Tasks for a DSP/AI Developer:
Research and choose appropriate digital signal processing (DSP) and machine learning libraries for processing and recognizing thoughts (review libraries available in OpebBCI)
Preprocess and clean the recorded brainwave data from OpenBCI (start with bci/data/junk)
Develop data format to store labels (json)
Process the raw brainwaves using FFT and other DSP techniques
Implement normalisation of the frequency data
Develop algorithms for feature extraction and classification of thoughts from the brainwave data
Train, validate, and optimize machine learning models for thought recognition
Implement a system to update and improve the machine learning models as more data is collected
Develop an API to expose the machine learning functionality to the web application
Write unit and integration tests for the developed algorithms and APIs
Collaborate with the Fullstack Next.js developer to integrate the machine learning services into the web application
Optimize the performance, accuracy, and scalability of the DSP/AI system