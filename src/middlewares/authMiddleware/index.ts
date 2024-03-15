import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify"
import APIError from '../../exceptions/api-v1'
import { app } from "../../server";
import { FastifyRedis } from "@fastify/redis"
import { JWT } from "@fastify/jwt"
import { findToken, validateToken } from "../../services/token-service/TokenService";


export default async function(req:FastifyRequest<AuthReqData>, rep:FastifyReply, done:HookHandlerDoneFunction){
    try {
        const authorizationHeader = req.headers.authorization
        if(!authorizationHeader) throw Error('un-auth')

        const accessToken = authorizationHeader.split(' ')[1]
        if(!accessToken) throw Error('un-auth')

        const jwt:JWT = app.jwt
        const redis:FastifyRedis = app.redis

        const userData:UserDTOI | null = await validateToken(accessToken, jwt)
        if(!userData) throw Error('un-auth')
        
        const tokenFromDb = await findToken(userData.id, redis)
        if(!tokenFromDb) throw Error('un-auth')        

        req.user = userData
    } catch (error) {
        return APIError(error as Error, rep, req)
    }
}