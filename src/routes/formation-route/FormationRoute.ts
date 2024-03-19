import { 
    FastifyInstance, 
    FastifyPluginOptions, 
    FastifyPluginAsync 
} from 'fastify'
import fp from 'fastify-plugin'
import APIError from '../../exceptions/api-v1'
import authMiddleware from '../../middlewares/authMiddleware'
import { UserPermissions } from '../../models/user/enums'
import { AddFormationPositionsSchema, AddFormationSchema, AddFormationsSchema, DeleteFormationPositionsSchema, DeleteFormationSchema, DeleteFormationsSchema, EditFormationPositionSchema, EditFormationSchema, GetAllFormationsSchema, GetFormationSchema, GetFormationsSchema } from './schema'

const UserRoutes: FastifyPluginAsync = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {

    fastify.post<RouteWithAuth<ReqData<FormationAdd>>>('/api/v1/formations/add', { schema: AddFormationSchema, preHandler: [ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthAddFormation }) ] }, async (req, rep) => {
        try {

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

    fastify.post<RouteWithAuth<ReqData<Array<FormationAdd>>>>('/api/v1/formations/add-formations', { schema: AddFormationsSchema, preHandler: [ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthAddFormations }) ] }, async (req, rep) => {
        try {

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

    fastify.post<RouteWithAuth<ReqData<FormationPositionsAdd>>>('/api/v1/formations/add-positions', { schema: AddFormationPositionsSchema, preHandler: [ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthAddFormationPositions }) ] }, async (req, rep) => {
        try {

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })



    fastify.delete<RouteWithAuth<ReqData<FormationID>>>('/api/v1/formations/delete', { schema: DeleteFormationSchema, preHandler:[ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthDeleteFormation }) ] }, async (req, rep) => {
        try {

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

    fastify.delete<RouteWithAuth<ReqData<ArrayOfFormationsID>>>('/api/v1/formations/delete-formations', { schema: DeleteFormationsSchema, preHandler:[ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthDeleteFormations }) ] }, async (req, rep) => {
        try {

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

    fastify.delete<RouteWithAuth<ReqData<FormationPositionsDelete>>>('/api/v1/formations/delete-positions', { schema: DeleteFormationPositionsSchema, preHandler:[ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthDeleteFormationPositions }) ] }, async (req, rep) => {
        try {

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })


    
    fastify.put<RouteWithAuth<ReqData<FormationEdit>>>('/api/v1/formations/edit', { preHandler: [authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthEditFormation }) ], schema: EditFormationSchema } , async (req, rep) => {
        try {
        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })  

    fastify.put<RouteWithAuth<ReqData<FormationPositionEdit>>>('/api/v1/formations/edit-position', { preHandler: [authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthEditFormationPosition }) ], schema: EditFormationPositionSchema } , async (req, rep) => {
        try {
        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })
    


    fastify.get<AuthReqData>('/api/v1/formations/get-all-formations', { preHandler: [authMiddleware, fastify.checkPermission({ permission: UserPermissions.GetAllFormations }) ], schema: GetAllFormationsSchema } , async (req, rep) => {
        try {

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })
    
    fastify.get<GetReqWithQueryParams<ArrayOfFormationsID>>('/api/v1/formations/get-formations', { preHandler: [authMiddleware, fastify.checkPermission({ permission: UserPermissions.GetFormations }) ], schema: GetFormationsSchema } , async (req, rep) => {
        try {

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })
    
    fastify.get<GetReqWithQueryParams<FormationID>>('/api/v1/formations/formation', { preHandler: [authMiddleware, fastify.checkPermission({ permission: UserPermissions.GetFormation }) ], schema: GetFormationSchema } , async (req, rep) => {
        try {

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

}

export default fp(UserRoutes)