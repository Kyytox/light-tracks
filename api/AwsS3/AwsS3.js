// import dotenv
import dotenv from "dotenv";
dotenv.config();

import { S3Client } from "@aws-sdk/client-s3";

// Create an Amazon S3 service client object.
export const s3Client = new S3Client({
    Region: process.env.AWS_REGION,
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export function createS3Client() {
    return new S3Client({
        Region: process.env.AWS_REGION,
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });
}
