import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

import { env } from '../constants/env.js';
dotenv.config();

export const s3 = new S3Client({
    region: env.awsRegion,
    credentials: {
        accessKeyId: env.awsAccessKeyId,
        secretAccessKey: env.awsSecretAccessKey,
    },
});
