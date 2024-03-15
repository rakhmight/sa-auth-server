import { Schema } from "mongoose"
import { FastifyRedis } from '@fastify/redis'
import { JWT } from "@fastify/jwt"
// import { encryptData } from "../../utils/encryptData"
// import { decryptData } from "../../utils/decryptData"

export async function generateTokens(payload:UserDTOI, jwt:JWT){
    const accessToken = await jwt.sign(payload, { expiresIn: '12h' })
    const refreshToken = await jwt.sign(payload, {expiresIn: '30d'})

    // const encryptedRefreshToken = await encryptData(JSON.stringify(payload.localKey), refreshToken)
    // const encryptedAccessToken = await encryptData(deviceSymmetricKey, accessToken)

    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    }
}

export async function saveToken(userID:Schema.Types.ObjectId, refreshToken:string, redis:FastifyRedis){
    const tokenData = await redis.set(`${userID}-rToken`, refreshToken, 'EX', 30*24*60*60)
    return tokenData
}

export async function removeToken(userID:Schema.Types.ObjectId, redis:FastifyRedis) {    
    const tokenData = await redis.del(`${userID}-rToken`)
    return tokenData
}

export async function validateToken(token:string, jwt:JWT):Promise<UserDTOI | null> { // Refresh & Access
    try {
        // const decryptedToken = await decryptData(JSON.stringify(symmetricKey), token)

        const userData:UserDTOI = await jwt.verify(token)
        return userData
    } catch (error) {
        return null
    }
}

export async function findToken(userID:Schema.Types.ObjectId, redis:FastifyRedis) {
    const tokenData = await redis.get(`${userID}-rToken`)
    return tokenData
}