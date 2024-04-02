import { FastifyPluginAsync, FastifyPluginOptions, FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import mongoose from 'mongoose';

const connectMongoDB: FastifyPluginAsync<MyPluginOptions> = async (
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) => {
    try {
        mongoose.connection.on('connected', () => {
            fastify.log.info({ actor: 'MongoDB' }, 'Connected')
        });
        mongoose.connection.on('disconnected', () => {
            fastify.log.error({ actor: 'MongoDB' }, 'Disconnected')
        });

        const db = await mongoose.connect(options.url, {
            autoIndex: false
        })
    } catch (error) {
        fastify.log.fatal({ actor: 'MongoDB' }, (error as Error).message)
        process.exit(1)
    }
};

export const dbPlugin = fp(connectMongoDB);

export const dbParams = {
    url: `mongodb://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_ADDRESS}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}`
}