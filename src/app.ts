import express, { json, urlencoded } from 'express'
import { createServer } from 'http'
import cors from 'cors'
import morgan from 'morgan'
import fileUpload from 'express-fileupload'
import { conversation_router } from './routers/conversation.js'
import { message_router } from './routers/message.js'

// Initialization
export const app = express()
export const http_server = createServer(app)

// Middleware configuration
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    })
)
app.use(
    json({
        limit: '50mb',
    })
)
app.use(urlencoded({ limit: '50mb', extended: true }))
app.use(morgan('dev'))
app.use(
    fileUpload({
        createParentPath: true,
    })
)

app.use('/api/v1/conversation', conversation_router)
app.use('/api/v1/message', message_router)