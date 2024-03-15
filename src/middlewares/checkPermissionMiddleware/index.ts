import { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions, FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify"
import fp from 'fastify-plugin';
import APIError from '../../exceptions/api-v1'
import { UserPermissions } from "../../models/user/enums"

// export default function(req:FastifyRequest, rep:FastifyReply, done:HookHandlerDoneFunction/*, options: { permission: typeof UserPermissions }*/){
//     try {
//         const userData = req.user as UserDTOI
//         if(!userData) throw Error('un-auth')

//         const hasPermission = userData.system.permissions.includes(options.permission)
//         if(!hasPermission) throw Error('no-access')

//     } catch (error) {
//         return APIError(error as Error, rep, req)
//     }
// }

const checkPermissionMiddleware: FastifyPluginAsync = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {
    fastify.decorate('checkPermission', function (options: { permission: UserPermissions }) {
        return async function (req: FastifyRequest, rep: FastifyReply, done: HookHandlerDoneFunction) {
            const userData = req.user as UserDTOI
            if(!userData) throw Error('un-auth')

            const hasPermission = userData.system.permissions.includes(options.permission)
            if(!hasPermission) throw Error('no-access')
        }
    })
}

export const checkPermissionPlugin = fp(checkPermissionMiddleware);