import { 
    FastifyInstance, 
    FastifyPluginOptions, 
    FastifyPluginAsync 
} from 'fastify'
import fp from 'fastify-plugin'
import APIError from '../../exceptions/api-v1'
import { UserSignupSchema, UserLoginSchema, UserLogoutSchema, UserRefreshSchema, UserDeleteSchema, EditUserSchema, GetAllUsersSchema } from './schema'
import { deleteUser, destroyUser, getAllUsers, login, logout, refresh, registration } from '../../services/user-service/UserService'
import authMiddleware from '../../middlewares/authMiddleware'
import { UserPermissions } from '../../models/user/enums'
// import checkPermissionMiddleware from '../../middlewares/checkPermissionMiddleware'

const UserRoutes: FastifyPluginAsync = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {


    fastify.post<RouteWithAuth<ReqData<UserSignup>>>('/api/v1/users/signup', { schema: UserSignupSchema, preHandler: [ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthSignup }) ] }, async (req, rep) => {
        try {

            const userData = await registration(req.body.data)

            if(userData){
                //TODO: notify other systems

                req.log.info(`[SA-Auth] Signup new user, ID: ${userData.user.id}`);
                return rep.code(200).send({statusCode: 200, data: { userData } })
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


    fastify.put<RouteWithData<ReqData<UserID>>>('/api/v1/user/refresh', { schema: UserRefreshSchema }, async (req, rep) => {
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


    fastify.delete<RouteWithAuth<ReqData<UserID>>>('/api/v1/user/delete', { schema: UserDeleteSchema, preHandler:[ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthDeleteUser }) ] }, async (req, rep) => {
        try {

            const userID = req.body.data.id
            const userData = await deleteUser(userID)

            if(userData){
                //TODO: notify other systems

                req.log.info(`[SA-Auth] Delete user, ID: ${userID}`);
                return rep.code(200).send({statusCode: 200, data: { OK: true, params: { matchedCount: 1 } } })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

    fastify.delete<RouteWithAuth<ReqData<UserID>>>('/api/v1/user/destroy', { schema: UserDeleteSchema, preHandler:[ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthDestroyUser }) ] }, async (req, rep) => {
        try {

            const userID = req.body.data.id
            const userData = await destroyUser(userID)

            if(userData){
                // TODO: notify other systems

                req.log.info(`[SA-Auth] Destroy user data, ID: ${userID}`);
                return rep.code(200).send({statusCode: 200, data: { OK: true, params: { matchedCount: 1 } } })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

    fastify.delete<RouteWithAuth<ReqData<UserID>>>('/api/v1/user/block', { schema: UserDeleteSchema, preHandler:[ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthDestroyUser }) ] }, async (req, rep) => {
        try {

            const userID = req.body.data.id
            const userData = await blockUser(userID)

            if(userData){
                // TODO: notify other systems

                req.log.info(`[SA-Auth] Block user, ID: ${userID}`);
                return rep.code(200).send({statusCode: 200, data: { OK: true, params: { matchedCount: 1 } } })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

    //TODO:
    fastify.put<RouteWithAuth<ReqData<EditUsers>>>('/api/v1/user/edit', { preHandler: [authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthEditUser }) ], schema: EditUserSchema } , async (req, rep) => { // TODO:
        try {

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })


    fastify.get<AuthReqData>('/api/v1/user/get-all-users', { preHandler: [authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthGetAllUsers }) ], schema: GetAllUsersSchema } , async (req, rep) => {
        try {
            const users = await getAllUsers()

            return rep.code(200).send({statusCode: 200, data: { users } })
        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

  // block user

  // delete users []
  // destroy users []
  // block users []

  // edit users (role properties) []

  // get users []
  // get user
}

export default fp(UserRoutes)