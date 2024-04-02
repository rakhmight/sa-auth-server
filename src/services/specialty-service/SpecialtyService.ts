import { Schema } from "mongoose"
import { SpecialtyModel } from "../../models/specialty/SpecialtyModel"
import SpecialtyDTO from "../../dtos/specialty/SpecialtyDTO"

export async function addSpecialty(specialtyData:SpecialtyAdd){
    const specialtyCandidate = validateSpecialty(specialtyData)

    const newSpecialty = await SpecialtyModel.create({ ...specialtyCandidate })
    const preparedSpecialtyData = prepareSpecialtyData(newSpecialty)

    return preparedSpecialtyData
}
export async function addSpecialties(specialtiesData:Array<SpecialtyAdd>) {
    const validatedSpecialtiesData = specialtiesData.map((specialtyData) => {
        const specialtyCandidate:SpecialtyAdd = validateSpecialty(specialtyData)
        return specialtyCandidate
    })

    const newSpecialties = await SpecialtyModel.create({ ...validatedSpecialtiesData })

    const preparedSpecialtyData = newSpecialties.map(newSpecialty => prepareSpecialtyData(newSpecialty))

    return preparedSpecialtyData
}

export async function deleteSpecialty(specialtyID:Schema.Types.ObjectId){
    const specialtyData = await SpecialtyModel.deleteOne({ _id: specialtyID })

    return specialtyData
}
export async function deleteSpecialties(specialties:Array<Schema.Types.ObjectId>){
    const specialtiesData = await SpecialtyModel.deleteMany({ _id: { $in: specialties } })

    return specialtiesData
}

export async function editSpecialty(specialtyData: SpecialtyEdit){
    const specialtyTmp: Omit<SpecialtyEdit, 'id'> = {}
    
    if(Object.keys(specialtyData).length < 0) throw new Error('bad-req')

    if(specialtyData.name) specialtyTmp.name = specialtyData.name
    if(specialtyData.ref) specialtyTmp.ref = specialtyData.ref

    const updatedSpecialty = await SpecialtyModel.findOneAndUpdate(
        { _id: specialtyData.id },
        { ...specialtyTmp }
    )

    if(!updatedSpecialty) throw Error('specialty-not-found')
    const preparedSpecialtyData = prepareSpecialtyData(updatedSpecialty)

    return preparedSpecialtyData
}

export async function getAllSpecialties(){
    const specialties = await SpecialtyModel.find()

    const specialtiesDTO:Array<SpecialtyDTOI> = specialties.map(specialty => SpecialtyDTO(specialty))
    return specialtiesDTO
}
export async function getSpecialties(specialties:Array<Schema.Types.ObjectId>){
    const specialtiesData = await SpecialtyModel.find(
        { _id: { $in: specialties } }
    )

    const specialtiesDTO:Array<SpecialtyDTOI> = specialtiesData.map(specialty => SpecialtyDTO(specialty))
    return specialtiesDTO
}
export async function getSpecialty(specialtyID:Schema.Types.ObjectId){
    const specialty = await SpecialtyModel.findById(specialtyID)
    if(!specialty) throw Error('specialty-not-found')

    const specialtyDTO:SpecialtyDTOI = SpecialtyDTO(specialty)
    return specialtyDTO
}

function prepareSpecialtyData(specialtyData:SpecialtyI){
    const specialtyDTO = SpecialtyDTO(specialtyData)

    return specialtyDTO
}

function validateSpecialty(specialtyData:SpecialtyAdd){
    const specialtyCandidate: SpecialtyAdd = {
        name: specialtyData.name,
        ref: specialtyData.ref
    }

    return specialtyCandidate
}