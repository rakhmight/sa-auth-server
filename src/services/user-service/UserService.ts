import { UserModel } from '../../models/user/UserModel';
import UserDTO from "../../dtos/user/UserDTO";
import { FastifyRedis } from '@fastify/redis'
import { JWT } from "@fastify/jwt";
import { findToken, generateTokens, removeToken, saveToken, validateToken } from '../token-service/TokenService';
import { Schema } from 'mongoose';

export async function registration(userData:UserSignup){
    const candidate = await UserModel.findOne({'auth.login': userData.auth.login})

    if(candidate) throw Error('user-exist')

    const newUser = await UserModel.create({ ...userData })

    const preparedUserData = prepareUserData(newUser)

    return preparedUserData
}

export async function login(loginData:UserLogin, jwt:JWT, redis:FastifyRedis){
    const user = await UserModel.findOne({ 'auth.login': loginData.auth.login })
    if(!user) throw Error('user-not-found')

    const isPasswordEquals = await user.comparePasswords(user.auth.password, loginData.auth.password)
    if(!isPasswordEquals) throw Error('pwd-wrong')
    
    const preparedUserData = await prepareFullUserData(user, jwt, redis,)

    return preparedUserData
}

export async function logout(userID:Schema.Types.ObjectId, redis:FastifyRedis) {
    const token = await removeToken(userID, redis)
    return token
}

export async function refresh(refreshToken:string, userID:Schema.Types.ObjectId, jwt:JWT, redis:FastifyRedis) {
    const user = await UserModel.findById(userID)
    if(!user) throw Error('user-not-found')
    
    if(!refreshToken) throw Error('un-auth')

    const userData = await validateToken(refreshToken, jwt)
    const tokenFromDb = await findToken(userID, redis)

    if(!userData || !tokenFromDb) throw Error('un-auth')

    const preparedUserData = await prepareFullUserData(user, jwt, redis,)

    return preparedUserData
}

export async function getAllUsers() {
    const users = await UserModel.find()

    const usersDTO:Array<UserDTOI> = users.map((user) => {
        return UserDTO(user)
    })

    return usersDTO
}

export async function deleteUser(userID:Schema.Types.ObjectId) {
    const users = await UserModel.updateOne({_id: userID}, {
        'status.isDeleted': true
    })

    return users
}

export async function destroyUser(userID:Schema.Types.ObjectId) {
    const users = await UserModel.deleteOne({ _id: userID })

    return users
}

async function prepareFullUserData(user:UserI, jwt:JWT, redis:FastifyRedis){
    const userDTO = UserDTO(user)

    const tokens = await generateTokens({...userDTO}, jwt)
    const tokenData = await saveToken(userDTO.id, tokens.refreshToken, redis)

    if(tokenData) return {
        ...tokens,
        user: userDTO
    }
}

function prepareUserData(userData: UserI){
    const userDTO = UserDTO(userData)

    return { user: userDTO }
} 