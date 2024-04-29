import { Schema } from "mongoose"
import generateRandomString from "../../utils/generateRandomString"
import { SystemModel } from "../../models/system/SystemModel"
import SystemDTO from "../../dtos/system/SystemDTO"

export async function addSystem(systemData: SystemAdd){
    const systemCandidate:SystemAdd = validateSystem(systemData)

    const newSystem = await SystemModel.create(systemCandidate)
    const preparedSystemData = prepareSystemData(newSystem, { new: true })

    return preparedSystemData
}
export async function addSystems(systems: Array<SystemAdd>){
    const validatedSystemsData = systems.map((systemData) => {
        const systemCandidate:SystemAdd = validateSystem(systemData)
        return systemCandidate
    })
    
    const newSystems = await SystemModel.create({ ...validatedSystemsData })

    const preparedSystemData = newSystems.map(newSystem => prepareSystemData(newSystem, { new: true }))

    return preparedSystemData
}

export async function refreshToken(systemID:Schema.Types.ObjectId){
    const systemData = await SystemModel.findByIdAndUpdate(
        { _id: systemID },
        {
            token: generateRandomString(36)
        }
    )

    if(!systemData) throw Error('system-not-found')
    const systemDTO = SystemDTO(systemData)

    return systemDTO
}

export async function deleteSystem(systemID:Schema.Types.ObjectId){
    const systemData = await SystemModel.deleteOne({ _id: systemID})

    return systemData
}
export async function deleteSystems(systems: Array<Schema.Types.ObjectId>){
    const systemsData = await SystemModel.deleteMany({ _id: { $in: systems } })

    return systemsData
}

export async function editSystem(systemData: SystemEdit){
    const systemTmp: Omit<SystemEdit, "id"> = {}

    if(Object.keys(systemData).length < 0) throw new Error('bad-req')

    if(systemData.name) systemTmp.name = systemData.name
    if(systemData.type) systemTmp.type = systemData.type
    if(systemData.IP4Address) systemTmp.IP4Address = systemData.IP4Address
    if(systemData.login) systemTmp.login = systemData.login
    if(systemData.receiveNotifications) systemTmp.receiveNotifications = systemData.receiveNotifications
    if(systemData.publicSignKey) systemTmp.publicSignKey = systemData.publicSignKey

    const updatedSystem = await SystemModel.findOneAndUpdate(
        { _id: systemData.id },
        { ...systemTmp }
    )

    if(!updatedSystem) throw Error('system-not-found')
    const preparedSystemData = prepareSystemData(updatedSystem)

    return preparedSystemData
}

export async function getAllSystems(){
    const systems = await SystemModel.find()

    const systemsDTO:Array<SystemDTOI> = systems.map(system => SystemDTO(system))
    return systemsDTO
}
export async function getSystems(systems: Array<Schema.Types.ObjectId>){
    const systemsData = await SystemModel.find(
        { _id: { $in: systems } }
    )

    const systemsDTO:Array<SystemDTOI> = systemsData.map(system => SystemDTO(system))
    return systemsDTO
}
export async function getSystem(systemID: Schema.Types.ObjectId){
    const system = await SystemModel.findById(systemID)
    if(!system) throw Error('system-not-found')

    const systemDTO = SystemDTO(system)
    return systemDTO
}

function prepareSystemData(systemData: SystemI, params?: {new: boolean}){
    const systemDTO = SystemDTO(systemData)

    if(params){
        if(params.new) (systemDTO as SystemDTOI & Pick<SystemI, 'token'>).token = systemData.token
    }

    return systemDTO
}

function validateSystem (systemData: SystemAdd):Omit<SystemI, "_id">{
    return {
        name: systemData.name,
        login: systemData.login,
        type: systemData.type,
        IP4Address: systemData.IP4Address,
        receiveNotifications: systemData.receiveNotifications,
        token: generateRandomString(36),
        publicSignKey: systemData.publicSignKey
    }
}