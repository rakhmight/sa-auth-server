import { FastifyReply, FastifyRequest } from 'fastify'

export default function (error:Error, rep:FastifyReply, req:FastifyRequest){
    switch (error.message) {
        // General
        case 'not-found':
            return rep.code(404).send({statusCode: 404, message: `Not found`})
        case 'no-access':
            return rep.code(403).send({statusCode: 403, message: `Access is denied (forbidden)`})
        case 'bad-req':
            return rep.code(400).send({statusCode: 400, message: `Bad request`})
        case 'env':
            req.log.fatal({ actor: 'Server Environment' }, 'One of the environment variables is not set')
            return rep.code(500).send({statusCode: 500, message: `Some technical problems on our side. Sorry`})

        // User
        case 'user-exist':
            return rep.code(409).send({statusCode: 409, message: `User with given login already exist`})
        case 'user-not-found':
            return rep.code(404).send({statusCode: 404, message: `User not found`})
        case 'un-auth':
            return rep.code(401).send({statusCode: 401, message: `Unauthorized`})
        case 'pwd-wrong':
            return rep.code(404).send({statusCode: 404, message: `User not found`})

        // Secure
        case 'locked':
            return rep.code(423).send({statusCode: 423, message: `Locked`})
        case 'invalid-key':
            return rep.code(423).send({statusCode: 423, message: `Invalid key (locked)`})

        case 'specialty-not-found':
            return rep.code(404).send({statusCode: 404, message: `Specialty not found`})
        case 'formation-not-found':
            return rep.code(404).send({statusCode: 404, message: `Formation not found`})
        case 'system-not-found':
            return rep.code(404).send({statusCode: 404, message: `System not found`})
    
        default:            
            req.log.error(error);
            return rep.code(500).send({statusCode: 500, message: `Some technical problems on our side. Sorry`})
    }
}