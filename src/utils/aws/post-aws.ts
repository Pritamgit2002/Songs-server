import { PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from '../../constants/env.js';
import { s3 } from '../../services/s3client.js';


type PostToAwsParams = {
    fileBuffer: Buffer;
    fileName: string;
    contentType?: string;
};

export const postToAws = async ({
    fileBuffer,
    fileName,
    contentType = 'application/octet-stream',
}: PostToAwsParams) => {
    try {
        const command = new PutObjectCommand({
            Bucket: env.awsBucketName,
            Key: fileName,
            Body: fileBuffer,
            ContentType: contentType,
        });

        const response = await s3.send(command);

        const fileUrl = `https://${env.awsBucketName}.s3.${env.awsRegion}.amazonaws.com/${fileName}`;

        return {
            success: true,
            url: fileUrl,
            etag: response.ETag,
        };
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw error;
    }
};