import { 
    FastifyInstance, 
    FastifyPluginOptions, 
    FastifyPluginAsync 
} from 'fastify'
import fp from 'fastify-plugin'
import APIError from '../../exceptions/api-v1'
import authMiddleware from '../../middlewares/authMiddleware'
import { UserPermissions } from '../../models/user/enums'
import { AddSpecialtiesSchema, AddSpecialtySchema, DeleteSpecialtiesSchema, DeleteSpecialtySchema, EditSpecialtySchema, GetAllSpecialtiesSchema, GetSpecialtiesSchema, GetSpecialtySchema } from './schema'
import { addSpecialties, addSpecialty, deleteSpecialties, deleteSpecialty, editSpecialty, getAllSpecialties, getSpecialties, getSpecialty } from '../../services/specialty-service/SpecialtyService'

const SpecialtyRoutes: FastifyPluginAsync = async (fastify: FastifyInstance, options: FastifyPluginOptions) => {

    fastify.post<RouteWithAuth<ReqData<SpecialtyAdd>>>('/api/v1/specialties/add', { schema: AddSpecialtySchema, preHandler: [ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthAddSpecialty }) ] }, async (req, rep) => {
        try {
            const specialtyData = await addSpecialty(req.body.data)

            if(specialtyData){
                //TODO: notify other systems

                req.log.info({ actor: 'Route: specialty' }, `Added new specialty, ID: ${specialtyData.id}`);
                return rep.code(200).send({statusCode: 200, data: { specialty: specialtyData } })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

    fastify.post<RouteWithAuth<ReqData<SpecialtiesAdd>>>('/api/v1/specialties/add-specialties', { schema: AddSpecialtiesSchema, preHandler: [ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthAddSpecialties }) ] }, async (req, rep) => {
        try {
            const specialties = req.body.data.specialties

            const specialtiesData = await addSpecialties(specialties)

            if(specialtiesData){
                //TODO: notify other systems

                req.log.info({ actor: 'Route: specialty' }, `Added group of new specialties, ID: ${specialtiesData.map(f => f.id).join(', ')}`);
                return rep.code(200).send({statusCode: 200, data: { specialties: specialtiesData } })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })



    fastify.delete<RouteWithAuth<ReqData<SpecialtyID>>>('/api/v1/specialties/delete', { schema: DeleteSpecialtySchema, preHandler:[ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthDeleteSpecialty }) ] }, async (req, rep) => {
        try {

            const specialtyID = req.body.data.id
            const specialtyData = await deleteSpecialty(specialtyID)

            if(specialtyData){
                //TODO: notify other systems

                req.log.info({ actor: 'Route: specialty' }, `Delete specialty, ID: ${specialtyData}`)
                return rep.code(200).send({statusCode: 200, data: { OK: true, params: specialtyData } })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

    fastify.delete<RouteWithAuth<ReqData<ArrayOfSpecialtiesID>>>('/api/v1/specialties/delete-specialties', { schema: DeleteSpecialtiesSchema, preHandler: [ authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthDeleteSpecialties }) ] }, async (req, rep) => {
        try {

            const specialtiesID = req.body.data.specialties
            const specialtiesData = await deleteSpecialties(specialtiesID)

            if(specialtiesData){
                //TODO: notify other systems

                req.log.info({ actor: 'Route: specialty' }, `Delete specialties, ID: ${specialtiesID.join(', ')}`);
                return rep.code(200).send({statusCode: 200, data: { OK: true, params: specialtiesData } })
            }

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })


    
    fastify.put<RouteWithAuth<ReqData<SpecialtyEdit>>>('/api/v1/specialties/edit', { preHandler: [authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthEditSpecialty }) ], schema: EditSpecialtySchema } , async (req, rep) => {
        try {

            const specialty = req.body.data
            const specialtyData = await editSpecialty(specialty)

            if(specialtyData){
                //TODO: notify other systems

                req.log.info({ actor: 'Route: specialty' }, `Edit specialty properties, ID: ${specialty.id}`)
                return rep.code(200).send({statusCode: 200, data: { OK: true, specialty: specialtyData } })
            }
        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })
    


    fastify.get<AuthReqData>('/api/v1/specialties/get-all-specialties', { preHandler: [authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthGetAllSpecialties }) ], schema: GetAllSpecialtiesSchema } , async (req, rep) => {
        try {

            const specialties = await getAllSpecialties()

            return rep.code(200).send({statusCode: 200, data: { specialties } })

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })
    
    fastify.get<GetReqWithQueryParams<ArrayOfSpecialtiesID>>('/api/v1/specialties/get-specialties', { preHandler: [authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthGetSpecialties }) ], schema: GetSpecialtiesSchema } , async (req, rep) => {
        try {

            const specialtiesID = req.query.specialties
            const specialties = await getSpecialties(specialtiesID)

            return rep.code(200).send({statusCode: 200, data: { specialties } })

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })
    
    fastify.get<GetReqWithQueryParams<SpecialtyID>>('/api/v1/specialties/specialty', { preHandler: [authMiddleware, fastify.checkPermission({ permission: UserPermissions.AuthGetSpecialty }) ], schema: GetSpecialtySchema } , async (req, rep) => {
        try {
            const specialtyID = req.query.id
            const specialty = await getSpecialty(specialtyID)

            return rep.code(200).send({statusCode: 200, data: { specialty } })

        } catch (error) {
            return APIError(error as Error, rep, req)
        }
    })

}

export default fp(SpecialtyRoutes)