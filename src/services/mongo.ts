import 'colors'

import mongoose from 'mongoose'

import { env as utils_env } from '../constants/env.js'

export const connect_db = async (): Promise<void> => {
    try {
        if (utils_env.db_url === 'NA') {
            console.error('No database URL provided, skipping connection'.yellow)
            return
        }

        await mongoose.connect(utils_env.db_url)
        const dbName = mongoose.connection.name
        console.log(`Database [${dbName}] connected successfully`.cyan)
    } catch (error) {
        console.error('database connection error:', error)
        throw error
    }
}

export const disconnect_db = async (): Promise<void> => {
    try {
        await mongoose.disconnect()
        console.log('Database disconnected successfully'.cyan)
    } catch (error) {
        console.error('Database disconnection error:', error)
        throw error
    }
}

export const get_db_status = (): string => {
    const state = mongoose.connection.readyState

    const status_map = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
        99: 'uninitialized',
    }

    return status_map[state] || 'unknown'
}

export const get_db_info = () => ({
    status: get_db_status(),
    name: mongoose.connection.name || 'unknown',
    host: mongoose.connection.host || 'unknown',
    port: mongoose.connection.port || 'unknown',
})
