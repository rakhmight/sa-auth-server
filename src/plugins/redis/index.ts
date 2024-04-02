import 'dotenv/config'
import { FastifyPluginAsync, FastifyPluginOptions, FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import Redis from 'ioredis'

const baseParams = {
    host: process.env.REDIS_DB_HOST,
    port: process.env.REDIS_DB_PORT,
    password: process.env.REDIS_DB_PASSWORD,
    user: process.env.REDIS_DB_USER,
    family: 4,
    closeClient: true,
}

export const JWTRedisParams = {
    ...baseParams,
    db: process.env.REDIS_JWT_DB_INDEX,
    namespace: 'jwt'
}

export const E2ERedisParams = {
    ...baseParams,
    db: process.env.REDIS_E2E_DB_INDEX,
    namespace: 'e2e'
}

const connectRedis: FastifyPluginAsync<MyPluginOptions> = async (
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) => {

    try {
        console.log(options);
        
        const jwtClient = new Redis({
            ...options
        })
        
        jwtClient.on('connect', () => {
            fastify.log.info({ actor: 'Redis' }, 'Connected');
        })
        jwtClient.on('ready', () => {
            fastify.log.info({ actor: 'Redis' }, 'Ready to use');
        })
        jwtClient.on('error', (error) => {
            fastify.log.error({ actor: 'Redis' }, `Disconnected: ${error.message}`)
            throw error 
        })
    
        fastify.decorate('jwtRedis', { jwtClient }) 
    } catch (error) {
        fastify.log.fatal({ actor: 'Redis' }, (error as Error).message)
        process.exit(1)
    }
}

console.log(typeof connectRedis)


export const redisPlugin = fp(connectRedis)