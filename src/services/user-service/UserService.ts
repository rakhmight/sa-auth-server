import { UserModel } from '../../models/user/UserModel';
import UserDTO from "../../dtos/user/UserDTO";
import { FastifyRedis } from '@fastify/redis'
import { JWT } from "@fastify/jwt";
import { findToken, generateTokens, removeToken, saveToken, validateToken } from '../token-service/TokenService';
import { Schema } from 'mongoose';
import { StudentEducationForms, UserRoles } from '../../models/user/enums';


export async function registration(userData:UserSignup){
    const candidate = await UserModel.findOne({'auth.login': userData.auth.login})

    if(candidate) throw Error('user-exist')

    const validatedUserData = validateAndPrepareUserData(userData)

    const newUser = await UserModel.create({ ...validatedUserData })

    const preparedUserData = prepareUserData(newUser)

    return preparedUserData
}
export async function registrationUsers(usersData:Array<UserSignup>){

    const validatedUsersData = await Promise.all(usersData.map(async (userData) => {
        const candidate = await UserModel.findOne({'auth.login': userData.auth.login})
        if(candidate) throw Error('user-exist')

        const validatedUserData = validateAndPrepareUserData(userData)
        return validatedUserData
    }))

    const newUsers = await UserModel.create(validatedUsersData)

    const preparedUsersData = newUsers.map((newUser) => prepareUserData(newUser))
    return preparedUsersData
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
export async function getUsers(usersID:Array<Schema.Types.ObjectId>) {
    const users = await UserModel.find(
        { _id: { $in: usersID } }
    )

    const usersDTO:Array<UserDTOI> = users.map((user) => {
        return UserDTO(user)
    })

    return usersDTO
}
export async function getUser(userID:Schema.Types.ObjectId) {
    const user = await UserModel.findOne(userID)
    if(!user) throw Error('user-not-found')

    const userDTO:UserDTOI = UserDTO(user)

    return userDTO
}

export async function deleteUser(userID:Schema.Types.ObjectId) {
    const userData = await UserModel.updateOne({_id: userID}, {
        'status.isDeleted': true
    })

    return userData
}
export async function deleteUsers(users:Array<Schema.Types.ObjectId>) {
    const usersData = await UserModel.updateMany(
        { _id: { $in: users } },
        { $set: { 'status.isDeleted': true } }
     )
     return usersData
}

export async function blockUser(userID:Schema.Types.ObjectId) {
    const userData = await UserModel.updateOne({_id: userID}, {
        'status.isBlocked': true
    })

    return userData
}
export async function blockUsers(users:Array<Schema.Types.ObjectId>) {
    const usersData = await UserModel.updateMany(
        { _id: { $in: users } },
        { $set: { 'status.isBlocked': true } }
     )
     return usersData
}

export async function destroyUser(userID:Schema.Types.ObjectId) {
    const userData = await UserModel.deleteOne({ _id: userID })

    return userData
}
export async function destroyUsers(users:Array<Schema.Types.ObjectId>) {
    const usersData = await UserModel.deleteMany(
        { _id: { $in: users } }
     )
     return usersData
}

export async function editUser(user: EditableUserProperties){
    if(Object.keys(user).length < 0) throw new Error('bad-req')
    const userCandidate = await UserModel.findById(user.id)

    if(!userCandidate) throw Error('user-not-found')

    const userTmp:Omit<EditableUserProperties, 'id'> = {}

    if(user.auth){
        userTmp.auth = {}
        if(user.auth.login) userTmp.auth.login = user.auth.login
        if(user.auth.password) userTmp.auth.password = user.auth.password
    }
    if(user.bio){
        userTmp.bio = {}
        if(user.bio.PINFL) userTmp.bio.PINFL = user.bio.PINFL
        if(user.bio.passport) userTmp.bio.passport = user.bio.passport
        if(user.bio.dateOfBirth) userTmp.bio.dateOfBirth = user.bio.dateOfBirth
        if(user.bio.firstName) userTmp.bio.firstName = user.bio.firstName
        if(user.bio.lastName) userTmp.bio.lastName = user.bio.lastName
        if(user.bio.patronymic) userTmp.bio.patronymic = user.bio.patronymic
        if(user.bio.geo){
            userTmp.bio.geo = {}
            if(user.bio.geo.countryISO) userTmp.bio.geo.countryISO = user.bio.geo.countryISO
            if(user.bio.geo.region) userTmp.bio.geo.region = user.bio.geo.region
        }
    }
    if(user.system){
        userTmp.system = {}
        if(user.system.role) userTmp.system.role = user.system.role
        if(user.system.permissions) userTmp.system.permissions = user.system.permissions
    }
    if(user.roleProperties){
        userTmp.roleProperties = {}
        if(user.roleProperties.formation) userTmp.roleProperties.formation = user.roleProperties.formation
        if(user.roleProperties.position) userTmp.roleProperties.position = user.roleProperties.position
        if(user.roleProperties.postgraduateEducation) {
            userTmp.roleProperties.postgraduateEducation = {}
            if(user.roleProperties.postgraduateEducation.date) userTmp.roleProperties.postgraduateEducation.date = user.roleProperties.postgraduateEducation.date
            if(user.roleProperties.postgraduateEducation.isActive || user.roleProperties.postgraduateEducation.isActive === false) userTmp.roleProperties.postgraduateEducation.isActive = user.roleProperties.postgraduateEducation.isActive
        }
        if(user.roleProperties.qualificationIncreasing) {
            userTmp.roleProperties.qualificationIncreasing = {}
            if(user.roleProperties.qualificationIncreasing.date) userTmp.roleProperties.qualificationIncreasing.date = user.roleProperties.qualificationIncreasing.date
            if(user.roleProperties.qualificationIncreasing.isActive || user.roleProperties.qualificationIncreasing.isActive === false) userTmp.roleProperties.qualificationIncreasing.isActive = user.roleProperties.qualificationIncreasing.isActive
        }

        if(user.roleProperties.dateOfAdmission) userTmp.roleProperties.dateOfAdmission = user.roleProperties.dateOfAdmission
        if(user.roleProperties.education) userTmp.roleProperties.education = user.roleProperties.education
        if(user.roleProperties.formOfEducation) userTmp.roleProperties.formOfEducation = user.roleProperties.formOfEducation
        if(user.roleProperties.specialty) userTmp.roleProperties.specialty = user.roleProperties.specialty
        if(user.roleProperties.group) userTmp.roleProperties.group = user.roleProperties.group
    }

    // uncorrected req 
    if(userTmp.system){
        if(userTmp.system.role){

            if(userTmp.system.role === UserRoles.Employee || userTmp.system.role === UserRoles.Teacher){
                if(userTmp.roleProperties){
                    if(userTmp.roleProperties.dateOfAdmission || userTmp.roleProperties.group || userTmp.roleProperties.specialty || userTmp.roleProperties.education || userTmp.roleProperties.formOfEducation) throw Error('bad-req')

                    if(userTmp.system.role !== userCandidate.system.role){
                        if(!userTmp.roleProperties.position || !userTmp.roleProperties.formation) throw Error('bad-req')

                        if(!userCandidate.roleProperties.postgraduateEducation) userTmp.roleProperties.postgraduateEducation = {
                            date: null,
                            isActive: false
                        }
                        if(!userCandidate.roleProperties.qualificationIncreasing) userTmp.roleProperties.qualificationIncreasing = {
                            date: null,
                            isActive: false
                        }
                    }
                }
            }

            if(userTmp.system.role === UserRoles.Enrollee || userTmp.system.role === UserRoles.Student){
                if(userTmp.roleProperties){
                    if(userTmp.roleProperties.position || userTmp.roleProperties.formation || userTmp.roleProperties.postgraduateEducation || userTmp.roleProperties.qualificationIncreasing) throw Error('bad-req')
    
                    if(userTmp.roleProperties.formOfEducation === StudentEducationForms.DoctoralStudies){
                        if(userTmp.roleProperties.group || userTmp.roleProperties.specialty) throw Error('bad-req')
                    }

                    if(userTmp.system.role !== userCandidate.system.role){
                        if(!userTmp.roleProperties.dateOfAdmission || !userTmp.roleProperties.education || !userTmp.roleProperties.formOfEducation) throw Error('bad-req')
                        if(userTmp.roleProperties.formOfEducation !== StudentEducationForms.DoctoralStudies){
                            if(!userTmp.roleProperties.group || !userTmp.roleProperties.specialty) throw Error('bad-req')
                        }

                    }
                }
            }

        } else {
            if(userTmp.roleProperties){
                if(userCandidate.roleProperties.formOfEducation === StudentEducationForms.DoctoralStudies && userTmp.roleProperties.group || userCandidate.roleProperties.formOfEducation === StudentEducationForms.DoctoralStudies && userTmp.roleProperties.specialty) throw Error('bad-req')
            }
        }
    }else {
        if(userTmp.roleProperties){
            if(userCandidate.roleProperties.formOfEducation === StudentEducationForms.DoctoralStudies && userTmp.roleProperties.group || userCandidate.roleProperties.formOfEducation === StudentEducationForms.DoctoralStudies && userTmp.roleProperties.specialty) throw Error('bad-req')
        }
    }

    const userData = await UserModel.updateOne({ _id: user.id }, {
        ...userTmp
    })

    return userData
}
export async function editUsers(users: Array<Schema.Types.ObjectId>, properties: EditableUsersProperties){

    // TODO: validation
    const allowedProperties:EditableUsersProperties = {}

    if(properties.system){
        allowedProperties.system = {}
        if(properties.system.role && !properties.roleProperties) throw Error('bad-req')
        if(properties.system.role) allowedProperties.system.role = properties.system.role
    }

    if(properties.roleProperties){
        allowedProperties.roleProperties = {}

        if(properties.system){
            if(properties.system.role){
                if(properties.system.role === UserRoles.Employee || properties.system.role === UserRoles.Teacher){
                    if(properties.roleProperties.dateOfAdmission || properties.roleProperties.education || properties.roleProperties.formOfEducation || properties.roleProperties.group || properties.roleProperties.specialty) throw Error('bad-req')
                }
                if(properties.system.role === UserRoles.Enrollee || properties.system.role === UserRoles.Student){
                    if(properties.roleProperties.formation || properties.roleProperties.position) throw Error('bad-req')

                    if(properties.roleProperties.formOfEducation === StudentEducationForms.DoctoralStudies){
                        if(properties.roleProperties.specialty || properties.roleProperties.group) throw Error('bad-req')
                    }
                }
            }
        }

        if(properties.roleProperties.dateOfAdmission || properties.roleProperties.education || properties.roleProperties.formOfEducation || properties.roleProperties.group || properties.roleProperties.specialty){
            if(properties.roleProperties.formation || properties.roleProperties.position) throw Error('bad-req')
        }
    
        if(properties.roleProperties.formation || properties.roleProperties.position){
            if(properties.roleProperties.dateOfAdmission || properties.roleProperties.education || properties.roleProperties.formOfEducation || properties.roleProperties.group || properties.roleProperties.specialty) throw Error('bad-req')
        }

        if(properties.roleProperties.dateOfAdmission) allowedProperties.roleProperties.dateOfAdmission = properties.roleProperties.dateOfAdmission
        if(properties.roleProperties.education) allowedProperties.roleProperties.education = properties.roleProperties.education
        if(properties.roleProperties.formOfEducation) allowedProperties.roleProperties.formOfEducation = properties.roleProperties.formOfEducation
        if(properties.roleProperties.group) allowedProperties.roleProperties.group = properties.roleProperties.group
        if(properties.roleProperties.specialty) allowedProperties.roleProperties.specialty = properties.roleProperties.specialty

        if(properties.roleProperties.formation) allowedProperties.roleProperties.formation = properties.roleProperties.formation
        if(properties.roleProperties.position) allowedProperties.roleProperties.position = properties.roleProperties.position
    }

    const usersData = await UserModel.updateMany(
        { _id: { $in: users } },
        { $set: { ...allowedProperties } }
    )

    return usersData
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

    return userDTO
}

function validateAndPrepareUserData(userData:UserSignup){

    if(userData.system.role === 'employee' || userData.system.role === 'teacher'){
        if(userData.roleProperties.formOfEducation || userData.roleProperties.group || userData.roleProperties.dateOfAdmission || userData.roleProperties.specialty) throw Error('bad-req')
        if(!userData.roleProperties.formation || !userData.roleProperties.position) throw Error('bad-req')

        if(!userData.roleProperties.postgraduateEducation){
            userData.roleProperties.postgraduateEducation, userData.roleProperties.qualificationIncreasing = {
                isActive: false,
                date: null
            }
        }
    }
    if(userData.system.role === 'enrollee' || userData.system.role === 'student'){
        if(userData.roleProperties.formation || userData.roleProperties.position) throw Error('bad-req')
        if(!userData.roleProperties.formOfEducation) throw Error('bad-req')

        if(userData.roleProperties.formOfEducation !== 'doctoral-studies' && !userData.roleProperties.group) throw Error('bad-req')
        if(userData.roleProperties.formOfEducation !== 'doctoral-studies' && !userData.roleProperties.specialty) throw Error('bad-req')
        if(!userData.roleProperties.dateOfAdmission || !userData.roleProperties.education) throw Error('bad-req')
    }

    return userData
}