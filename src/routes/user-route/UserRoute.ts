import { 
    FastifyInstance, 
    FastifyPluginOptions, 
    FastifyPluginAsync 
} from 'fastify'
import fp from 'fastify-plugin'
import APIError from '../../exceptions/api-v1'
import { UserSignupSchema, UserLoginSchema, UserLogoutSchema, UserRefreshSchema, UserDeleteSchema, EditUserSchema, GetAllUsersSchema, EditUsersSchema, GetUsersSchema, GetUserSchema, UsersDeleteSchema, UserDestroySchema, UsersDestroySchema, UserBlockSchema, UsersBlockSchema, UsersSignupSchema } from './schema'
import { blockUser, blockUsers, deleteUser, deleteUsers, destroyUser, destroyUsers, editUser, editUsers, getAllUsers, getUser, getUsers, login, logout, refresh, registration, registrationUsers } from '../../services/user-service/UserService'
import authMiddleware from '../../middlewares/authMiddleware'
import { UserPermissions } from '../../models/user/enums'
// import checkPermissionMiddleware from '../../middlewares/checkPermissionMiddleware'

const UserRoutes: FastifyPluginAsync = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {


    fastify.post<RouteWithAuth<ReqData<UserSignup>>>('/api/v1/users/signup', { schema: UserSignupSchema, preHandler: [ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthSignup }) ] }, async (req, rep) => {
        try {

            const userData = await registration(req.body.data)

            if(userData){
                //TODO: notify other systems

                req.log.info(`[SA-Auth] Signup new user, ID: ${userData.id}`);
                return rep.code(200).send({statusCode: 200, data: { user: userData } })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

    fastify.post<RouteWithAuth<ReqData<UsersSignup>>>('/api/v1/users/signup-users', { schema: UsersSignupSchema, preHandler: [ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthSignupUsers }) ] }, async (req, rep) => {
        try {

            const users = req.body.data.users
            const usersData = await registrationUsers(users)

            if(usersData){
                //TODO: notify other systems

                req.log.info(`[SA-Auth] Signup group of new users, ID: ${usersData.map(u => u.id).join(', ')}`);
                return rep.code(200).send({statusCode: 200, data: { users: usersData } })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })



    fastify.post<RouteWithData<ReqData<UserLogin>>>('/api/v1/users/login', { schema: UserLoginSchema }, async (req, rep) => {
        try {
            const { redis, jwt } = fastify

            const userData = await login(req.body.data, jwt, redis)

            if(userData) {
                // TODO: notify other systems (auth service)

                req.log.info(`[SA-Messenger] User login, ID: ${userData.user.id}`);
                rep.cookie('refreshToken', userData.refreshToken, { maxAge: 5*24*60*60*1000, httpOnly: true , path: '/'})
                return rep.code(200).send({statusCode: 200, data: userData })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

    fastify.post<RouteWithAuth<ReqData<UserID>>>('/api/v1/users/logout', { schema: UserLogoutSchema, preHandler: [authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthLogout }) ] }, async (req, rep) => {
        try {
            const { redis } = fastify
            const userID = req.body.data.id
            
            const token = await logout(userID, redis)

            if(token){
                // TODO: notify other systems (auth service)

                req.log.info(`[SA-Messenger] User logout, ID: ${userID}`);
                rep.clearCookie('refreshToken', { path: '/' })
                return rep.code(200).send({ statusCode: 200, data: { token } })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

    fastify.put<RouteWithData<ReqData<UserID>>>('/api/v1/users/refresh', { schema: UserRefreshSchema }, async (req, rep) => {
        try {
            const { refreshToken } = req.cookies
            const { redis, jwt } = fastify

            const userID = req.body.data.id
            const userData = await refresh(refreshToken as string, userID, jwt, redis)

            if(userData){
                // TODO: notify other systems (auth service)

                rep.cookie('refreshToken', userData.refreshToken, { maxAge: 30*24*60*60*1000, httpOnly: true , path: '/'})
                return rep.code(200).send({statusCode: 200, data: userData })
            }
        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })



    fastify.delete<RouteWithAuth<ReqData<UserID>>>('/api/v1/users/delete', { schema: UserDeleteSchema, preHandler:[ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthDeleteUser }) ] }, async (req, rep) => {
        try {

            const userID = req.body.data.id
            const userData = await deleteUser(userID)

            if(userData){
                //TODO: notify other systems
                // delete tokens

                req.log.info(`[SA-Auth] Delete user, ID: ${userID}`);
                return rep.code(200).send({statusCode: 200, data: { OK: true, params: userData } })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

    fastify.delete<RouteWithAuth<ReqData<ArrayOfUsersID>>>('/api/v1/users/delete-users', { schema: UsersDeleteSchema, preHandler:[ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthDeleteUsers }) ] }, async (req, rep) => {
        try {

            const usersID = req.body.data.users
            const usersData = await deleteUsers(usersID)

            if(usersData){
                //TODO: notify other systems
                // delete tokens

                req.log.info(`[SA-Auth] Delete users, ID: ${usersID.join(', ')}`);
                return rep.code(200).send({statusCode: 200, data: { OK: true, params: usersData } })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

    fastify.delete<RouteWithAuth<ReqData<UserID>>>('/api/v1/users/destroy', { schema: UserDestroySchema, preHandler:[ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthDestroyUser }) ] }, async (req, rep) => {
        try {

            const userID = req.body.data.id
            const userData = await destroyUser(userID)

            if(userData){
                // TODO: notify other systems
                // delete tokens

                req.log.info(`[SA-Auth] Destroy user data, ID: ${userID}`);
                return rep.code(200).send({statusCode: 200, data: { OK: true, params: userData } })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

    fastify.delete<RouteWithAuth<ReqData<ArrayOfUsersID>>>('/api/v1/users/destroy-users', { schema: UsersDestroySchema, preHandler:[ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthDestroyUsers }) ] }, async (req, rep) => {
        try {

            const usersID = req.body.data.users
            const usersData = await destroyUsers(usersID)

            if(usersData){
                //TODO: notify other systems
                // delete tokens

                req.log.info(`[SA-Auth] Destroy users data, ID: ${usersID.join(', ')}`);
                return rep.code(200).send({statusCode: 200, data: { OK: true, params: usersData } })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

    fastify.delete<RouteWithAuth<ReqData<UserID>>>('/api/v1/users/block', { schema: UserBlockSchema, preHandler:[ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthBlockUser }) ] }, async (req, rep) => {
        try {

            const userID = req.body.data.id
            const userData = await blockUser(userID)

            if(userData){
                // TODO: notify other systems
                // delete tokens

                req.log.info(`[SA-Auth] Block user, ID: ${userID}`);
                return rep.code(200).send({statusCode: 200, data: { OK: true, params: userData } })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

    fastify.delete<RouteWithAuth<ReqData<ArrayOfUsersID>>>('/api/v1/users/block-users', { schema: UsersBlockSchema, preHandler:[ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthBlockUsers }) ] }, async (req, rep) => {
        try {

            const usersID = req.body.data.users
            const usersData = await blockUsers(usersID)

            if(usersData){
                //TODO: notify other systems
                // delete tokens

                req.log.info(`[SA-Auth] Block users, ID: ${usersID.join(', ')}`);
                return rep.code(200).send({statusCode: 200, data: { OK: true, params: usersData } })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })



    fastify.put<RouteWithAuth<ReqData<EditUser>>>('/api/v1/users/edit', { preHandler: [authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthEditUser }) ], schema: EditUserSchema } , async (req, rep) => {
        try {
            const user = req.body.data.user
            const userData = await editUser(user)

            if(userData){
                //TODO: notify other systems

                req.log.info(`[SA-Auth] Edit user properties, ID: ${user.id}`)
                return rep.code(200).send({statusCode: 200, data: { OK: true, user: userData } })
            }
        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })
    fastify.put<RouteWithAuth<ReqData<EditUsers>>>('/api/v1/users/edit-users', { preHandler: [authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthEditUsers }) ], schema: EditUsersSchema } , async (req, rep) => {
        try {
            const users = req.body.data.users
            const properties = req.body.data.properties

            const usersData = await editUsers(users, properties)

            if(usersData){
                //TODO: notify other systems

                req.log.info(`[SA-Auth] Edit users properties, ID: ${users.join(', ')}`);
                return rep.code(200).send({statusCode: 200, data: { OK: true, params: usersData } })
            }
        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })



    fastify.get<AuthReqData>('/api/v1/users/get-all-users', { preHandler: [authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthGetAllUsers }) ], schema: GetAllUsersSchema } , async (req, rep) => {
        try {
            const users = await getAllUsers()

            return rep.code(200).send({statusCode: 200, data: { users } })
        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

    fastify.get<GetReqWithQueryParams<ArrayOfUsersID>>('/api/v1/users/get-users', { preHandler: [authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthGetUsers }) ], schema: GetUsersSchema } , async (req, rep) => {
        try {
            const usersID = req.query.users
            const users = await getUsers(usersID)

            return rep.code(200).send({statusCode: 200, data: { users } })
        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

    fastify.get<GetReqWithQueryParams<UserID>>('/api/v1/users/get', { preHandler: [authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthGetUser }) ], schema: GetUserSchema } , async (req, rep) => {
        try {
            const userID = req.query.id
            const user = await getUser(userID)

            return rep.code(200).send({statusCode: 200, data: { user } })
        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })
}

export default fp(UserRoutes)