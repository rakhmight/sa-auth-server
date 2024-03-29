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
import { addFormation, addFormationPositions, addFormations, deleteFormation, deleteFormationPositions, deleteFormations, editFormation, editFormationPosition, getAllFormations, getFormation, getFormations } from '../../services/formation-service/FormationService'

const FormationRoutes: FastifyPluginAsync = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {

    fastify.post<RouteWithAuth<ReqData<FormationAdd>>>('/api/v1/formations/add', { schema: AddFormationSchema, preHandler: [ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthAddFormation }) ] }, async (req, rep) => {
        try {

            const formationData = await addFormation(req.body.data)
            
            if(formationData){
                //TODO: notify other systems

                req.log.info(`[SA-Auth] Added new formation, ID: ${formationData.id}`);
                return rep.code(200).send({statusCode: 200, data: { formation: formationData } })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

    fastify.post<RouteWithAuth<ReqData<FormationsAdd>>>('/api/v1/formations/add-formations', { schema: AddFormationsSchema, preHandler: [ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthAddFormations }) ] }, async (req, rep) => {
        try {
            const formations = req.body.data.formations

            const formationsData = await addFormations(formations)

            if(formationsData){
                //TODO: notify other systems

                req.log.info(`[SA-Auth] Added group of new formations, ID: ${formationsData.map(f => f.id).join(', ')}`);
                return rep.code(200).send({statusCode: 200, data: { formations: formationsData } })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

    fastify.post<RouteWithAuth<ReqData<FormationPositionsAdd>>>('/api/v1/formations/add-positions', { schema: AddFormationPositionsSchema, preHandler: [ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthAddFormationPositions }) ] }, async (req, rep) => {
        try {

            const formationData = await addFormationPositions(req.body.data)
            
            if(formationData){
                //TODO: notify other systems

                req.log.info(`[SA-Auth] Add new positions to formation, ID: ${req.body.data.id}`);
                return rep.code(200).send({statusCode: 200, data: { OK: true, params: formationData } })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })



    fastify.delete<RouteWithAuth<ReqData<FormationID>>>('/api/v1/formations/delete', { schema: DeleteFormationSchema, preHandler:[ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthDeleteFormation }) ] }, async (req, rep) => {
        try {

            const formationID = req.body.data.id
            const formationData = await deleteFormation(formationID)

            if(formationData){
                //TODO: notify other systems

                req.log.info(`[SA-Auth] Delete formations, ID: ${formationID}`);
                return rep.code(200).send({statusCode: 200, data: { OK: true, params: formationData } })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

    fastify.delete<RouteWithAuth<ReqData<ArrayOfFormationsID>>>('/api/v1/formations/delete-formations', { schema: DeleteFormationsSchema, preHandler: [ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthDeleteFormations }) ] }, async (req, rep) => {
        try {

            const formationsID = req.body.data.formations

            const formationsData = await deleteFormations(formationsID)

            if(formationsData){
                //TODO: notify other systems

                req.log.info(`[SA-Auth] Delete formations, ID: ${formationsID.join(', ')}`);
                return rep.code(200).send({statusCode: 200, data: { OK: true, params: formationsData } })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

    fastify.delete<RouteWithAuth<ReqData<FormationPositionsDelete>>>('/api/v1/formations/delete-positions', { schema: DeleteFormationPositionsSchema, preHandler: [ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthDeleteFormationPositions }) ] }, async (req, rep) => {
        try {

            const { id, positions } = req.body.data
            const formationData = await deleteFormationPositions(id, positions)

            if(formationData){
                //TODO: notify other systems

                req.log.info(`[SA-Auth] Delete positions in formation, ID: ${id}`);
                return rep.code(200).send({statusCode: 200, data: { OK: true, formation: formationData } })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })


    
    fastify.put<RouteWithAuth<ReqData<FormationEdit>>>('/api/v1/formations/edit', { preHandler: [authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthEditFormation }) ], schema: EditFormationSchema } , async (req, rep) => {
        try {

            const formation = req.body.data
            const formationData = await editFormation(formation)

            if(formationData){
                //TODO: notify other systems

                req.log.info(`[SA-Auth] Edit formation properties, ID: ${formation.id}`)
                return rep.code(200).send({statusCode: 200, data: { OK: true, formation: formationData } })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })  

    fastify.put<RouteWithAuth<ReqData<FormationPositionEdit>>>('/api/v1/formations/edit-position', { preHandler: [authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthEditFormationPosition }) ], schema: EditFormationPositionSchema } , async (req, rep) => {
        try {

            const formation = req.body.data
            const formationData = await editFormationPosition(formation)

            if(formationData){
                //TODO: notify other systems

                req.log.info(`[SA-Auth] Edit formation positions, ID: ${formation.id}`)
                return rep.code(200).send({statusCode: 200, data: { OK: true, params: formationData } })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })
    


    fastify.get<AuthReqData>('/api/v1/formations/get-all-formations', { preHandler: [authMiddleware, fastify.checkPermission({ permission: UserPermissions.GetAllFormations }) ], schema: GetAllFormationsSchema } , async (req, rep) => {
        try {

            const formations = await getAllFormations()

            return rep.code(200).send({statusCode: 200, data: { formations } })

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })
    
    fastify.get<GetReqWithQueryParams<ArrayOfFormationsID>>('/api/v1/formations/get-formations', { preHandler: [authMiddleware, fastify.checkPermission({ permission: UserPermissions.GetFormations }) ], schema: GetFormationsSchema } , async (req, rep) => {
        try {
            const formationsID = req.query.formations
            const formations = await getFormations(formationsID)

            return rep.code(200).send({statusCode: 200, data: { formations } })
        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })
    
    fastify.get<GetReqWithQueryParams<FormationID>>('/api/v1/formations/formation', { preHandler: [authMiddleware, fastify.checkPermission({ permission: UserPermissions.GetFormation }) ], schema: GetFormationSchema } , async (req, rep) => {
        try {
            const formationID = req.query.id
            const formation = await getFormation(formationID)

            return rep.code(200).send({statusCode: 200, data: { formation } })
        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

}

export default fp(FormationRoutes)