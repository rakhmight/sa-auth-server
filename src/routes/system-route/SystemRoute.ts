import { 
    FastifyInstance, 
    FastifyPluginOptions, 
    FastifyPluginAsync 
} from 'fastify'
import fp from 'fastify-plugin'
import APIError from '../../exceptions/api-v1'
import authMiddleware from '../../middlewares/authMiddleware'
import { UserPermissions } from '../../models/user/enums'
import { AddSystemSchema, AddSystemsSchema, DeleteSystemSchema, DeleteSystemsSchema, EditSystemSchema, GetAllSystemsSchema, GetSystemSchema, GetSystemsSchema, RefreshSystemTokenSchema } from './schema'
import { addSystem, addSystems, deleteSystem, deleteSystems, editSystem, getAllSystems, getSystem, getSystems, refreshToken } from '../../services/system-service/SystemService'

const SystemRoutes: FastifyPluginAsync = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {

    fastify.post<RouteWithAuth<ReqData<SystemAdd>>>('/api/v1/systems/add', { schema: AddSystemSchema, preHandler: [ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthAddSystem }) ] }, async (req, rep) => {
        try {
            const systemData = await addSystem(req.body.data)

            if(systemData){
                req.log.info({ actor: 'Route: system' }, `Added new system, ID: ${systemData.id}`);
                return rep.code(200).send({statusCode: 200, data: { system: systemData } })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

    fastify.post<RouteWithAuth<ReqData<SystemsAdd>>>('/api/v1/systems/add-systems', { schema: AddSystemsSchema, preHandler: [ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthAddSystems }) ] }, async (req, rep) => {
        try {
            const systems = req.body.data.systems

            const systemsData = await addSystems(systems)

            if(systemsData){
                req.log.info({ actor: 'Route: system' }, `Added group of new systems, ID: ${systemsData.map(f => f.id).join(', ')}`);
                return rep.code(200).send({statusCode: 200, data: { systems: systemsData } })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })



    fastify.put<RouteWithAuth<ReqData<SystemID>>>('/api/v1/systems/refresh-token', { schema: RefreshSystemTokenSchema, preHandler: [ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthRefreshSystemToken }) ] }, async (req, rep) => {
        try {

            const systemID = req.body.data.id
            const systemData = await refreshToken(systemID)

            if(systemData){
                req.log.info({ actor: 'Route: system' }, `Refresh system token, ID: ${systemData.id}`);
                return rep.code(200).send({statusCode: 200, data: { system: systemData } })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })



    fastify.delete<RouteWithAuth<ReqData<SystemID>>>('/api/v1/systems/delete', { schema: DeleteSystemSchema, preHandler:[ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthDeleteSystem }) ] }, async (req, rep) => {
        try {

            const systemID = req.body.data.id
            const systemData = await deleteSystem(systemID)

            if(systemData){
                req.log.info({ actor: 'Route: system' }, `Delete system, ID: ${systemData}`)
                return rep.code(200).send({statusCode: 200, data: { OK: true, params: systemData } })
            }
        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

    fastify.delete<RouteWithAuth<ReqData<ArrayOfSystemsID>>>('/api/v1/systems/delete-systems', { schema: DeleteSystemsSchema, preHandler: [ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthDeleteSystems }) ] }, async (req, rep) => {
        try {

            const systemsID = req.body.data.systems
            const systemsData = await deleteSystems(systemsID)

            if(systemsData){
                req.log.info({ actor: 'Route: system' }, `Delete systems, ID: ${systemsID.join(', ')}`);
                return rep.code(200).send({statusCode: 200, data: { OK: true, params: systemsData } })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })


    
    fastify.put<RouteWithAuth<ReqData<SystemEdit>>>('/api/v1/systems/edit', { preHandler: [authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthEditSystem }) ], schema: EditSystemSchema } , async (req, rep) => {
        try {

            const system = req.body.data
            const systemData = await editSystem(system)

            if(systemData){
                req.log.info({ actor: 'Route: system' }, `Edit system properties, ID: ${system.id}`)
                return rep.code(200).send({statusCode: 200, data: { OK: true, system: systemData } })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })
    


    fastify.get<AuthReqData>('/api/v1/systems/get-all-systems', { preHandler: [authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthGetAllSystems }) ], schema: GetAllSystemsSchema } , async (req, rep) => {
        try {

            const systems = await getAllSystems()

            return rep.code(200).send({statusCode: 200, data: { systems } })

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })
    
    fastify.get<GetReqWithQueryParams<ArrayOfSystemsID>>('/api/v1/systems/get-systems', { preHandler: [authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthGetSystems }) ], schema: GetSystemsSchema } , async (req, rep) => {
        try {

            const systemsID = req.query.systems
            const systems = await getSystems(systemsID)

            return rep.code(200).send({statusCode: 200, data: { systems } })

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })
    
    fastify.get<GetReqWithQueryParams<SystemID>>('/api/v1/systems/system', { preHandler: [authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthGetSystem }) ], schema: GetSystemSchema } , async (req, rep) => {
        try {
            const systemID = req.query.id
            const system = await getSystem(systemID)

            return rep.code(200).send({statusCode: 200, data: { system } })

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

}

export default fp(SystemRoutes)