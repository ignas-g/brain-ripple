// utils/saveToS3.ts
import AWS from 'aws-sdk';
import { ReadStream } from 'fs';

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_S3_BUCKET_NAME,
} = process.env;

// Configure the AWS SDK
AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

const s3 = new AWS.S3();

export async function saveCsvToS3(key: string, fileStream: ReadStream): Promise<string> {
  const uploadParams: AWS.S3.PutObjectRequest = {
    Bucket: AWS_S3_BUCKET_NAME as string,
    Key: key,
    Body: fileStream,
    ContentType: 'text/csv',
  };

  try {
    await s3.upload(uploadParams).promise();
    const publicUrl = `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;
    return publicUrl;
  } catch (error) {
    console.error('Error uploading CSV to S3:', error);
    throw error;
  }
}
