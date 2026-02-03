import dotenv from 'dotenv'
import path from 'path'

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

export type TNodeEnv = 'development' | 'production' | 'test'

type TEnv = {
    node_env: TNodeEnv
    api_port: number
    db_url: string | 'NA'
    awsAccessKeyId: string
    awsSecretAccessKey: string
    awsRegion: string
    awsBucketName: string
}

export const env: TEnv = {
    node_env: process.env.NODE_ENV as TNodeEnv,
    api_port: Number(process.env.API_PORT),
    db_url: process.env.DB_URL || 'NA',
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || 'NA',
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'NA',
    awsRegion: process.env.AWS_REGION || 'NA',
    awsBucketName: process.env.AWS_BUCKET_NAME || 'NA',
}
