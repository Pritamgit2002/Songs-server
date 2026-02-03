import { env } from './constants/env.js'
import { http_server } from './app.js'
import { connect_db, disconnect_db } from './services/mongo.js'

const start_server = async () => {
    try {
        // connect database
        await connect_db()

        // start server
        http_server.listen(env.api_port, () => {
            // timeouts for long-running requests
            http_server.keepAliveTimeout = 120000
            http_server.headersTimeout = 125000

            console.log(`Server running on port ${env.api_port}`)
        })
    } catch (error) {
        console.error('Failed to start server', error)
        process.exit(1)
    }
}

const graceful_shutdown = async () => {
    try {
        console.log('Shutting down server...')
        await disconnect_db()
        process.exit(0)
    } catch (error) {
        console.error('Shutdown error', error)
        process.exit(1)
    }
}

const handle_fatal_error = (
    error: Error,
    type: 'rejection' | 'exception'
) => {
    console.error(`Unhandled ${type}`, error)
    graceful_shutdown()
}

// start app
start_server()

// system signals
process.on('SIGTERM', graceful_shutdown)
process.on('SIGINT', graceful_shutdown)

// fatal errors
process.on('unhandledRejection', (error: Error) => {
    handle_fatal_error(error, 'rejection')
})

process.on('uncaughtException', (error: Error) => {
    handle_fatal_error(error, 'exception')
})
