import { 
    FastifyInstance, 
    FastifyPluginOptions, 
    FastifyPluginAsync 
} from 'fastify';
import fp from 'fastify-plugin';
import getHash from '../../utils/getHash';
import { signData } from '../../utils/serverSigning';

const PingRoute: FastifyPluginAsync = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {

    fastify.get('/api/ping', async (req, rep) => {
        const data = {
            ok: true,
            msg: 'Pong!',
            time: rep.getResponseTime(),
            server: 'sa-auth-server'
        }

        const preparedData = {
            ...data,
            hash: getHash(JSON.stringify(data)),
        }

        req.log.info({ actor: 'Route: ping' }, 'Ping')
        return rep.code(200).send({statusCode: 200, data: {
            ...preparedData,
            sign: signData(JSON.stringify(preparedData)),
            publicKey: process.env.SERVER_SIGNING_PUBLIC
        }})
    })
}

export default fp(PingRoute)