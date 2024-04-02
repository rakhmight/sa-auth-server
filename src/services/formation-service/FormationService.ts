import { Schema } from "mongoose"
import FormationDTO from "../../dtos/formation/FormationDTO"
import { FormationModel } from "../../models/formation/FormationModel"

export async function addFormation(formationData:FormationAdd) {
    const formationCandidate:FormationAdd = validateFormation(formationData)

    const newFormation = await FormationModel.create({ ...formationCandidate })
    const preparedFormationData = prepareFormationData(newFormation)

    return preparedFormationData
}
export async function addFormations(formationsData:Array<FormationAdd>){
    const validatedFormationsData = formationsData.map((formationData) => {
        const formationCandidate:FormationAdd = validateFormation(formationData)
        return formationCandidate
    })

    const newFormations = await FormationModel.create({ ...validatedFormationsData })

    const preparedFormationData = newFormations.map(newFormation => prepareFormationData(newFormation))

    return preparedFormationData
}
export async function addFormationPositions(formationData: FormationPositionsAdd){
    const formation = await FormationModel.findById(formationData.id)

    if(!formation) throw Error('formation-not-found')

    let lastPositionID = formation.counter+1
    const positionsData = formationData.positions.map(position => {
        const positionData = {
            name: position.name,
            id: lastPositionID
        }
        lastPositionID++

        return positionData
    })

    const formationUpdate = await FormationModel.updateOne({ _id: formationData.id }, {
        $push: {
            positions: { $each: positionsData },
            counter: lastPositionID
        }
    })

    return formationUpdate
}

export async function deleteFormation(formationID: Schema.Types.ObjectId){
    const formationData = await FormationModel.deleteOne({ _id: formationID })

    return formationData
}
export async function deleteFormations(formations: Array<Schema.Types.ObjectId>){
    const formationsData = await FormationModel.deleteMany({ _id: { $in: formations } })

    return formationsData
}
export async function deleteFormationPositions(formation: Schema.Types.ObjectId, positions: Array<FormationPositionID>){
    const formationData = await FormationModel.findOneAndUpdate({ _id: formation }, {
        $pull: {
            positions: { $each: positions}
        }
    })

    if(!formationData) throw Error('formation-not-found')
    const preparedFormationData = prepareFormationData(formationData)

    return preparedFormationData
}

export async function editFormation(formationData:FormationEdit) {
    const formationTmp: Omit<FormationEdit, 'id'> = {}
    
    if(Object.keys(formationData).length < 0) throw new Error('bad-req')

    if(formationData.name) formationTmp.name = formationData.name
    if(formationData.type) formationTmp.type = formationData.type
    if(formationData.ref) formationTmp.ref = formationData.ref
    if(formationData.generation) formationTmp.generation = formationData.generation
    if(formationData.child) formationTmp.child = formationData.child

    const updatedFormation = await FormationModel.findOneAndUpdate(
        { _id: formationData.id },
        { ...formationTmp }
    )

    if(!updatedFormation) throw Error('formation-not-found')
    const preparedFormationData = prepareFormationData(updatedFormation)

    return preparedFormationData
}
export async function editFormationPosition(formationData: FormationPositionEdit){

    const updatedFormation = await FormationModel.findOneAndUpdate(
        { _id: formationData.id },
        {
            $set: {
                'positions.$[formation].name': formationData.position.name
            }
        },
        {
            arrayFilters: [
                { 'position.id': formationData.position.id }
            ]
        }
    )

    if(!updatedFormation) throw Error('formation-not-found')
    const preparedFormationData = prepareFormationData(updatedFormation)

    return preparedFormationData
}

export async function getAllFormations(){
    const formations = await FormationModel.find()

    const formationsDTO:Array<FormationDTOI> = formations.map(formation => FormationDTO(formation))
    return formationsDTO
}
export async function getFormations(formations: Array<Schema.Types.ObjectId>){
    const formationsData = await FormationModel.find(
        { _id: { $in: formations } }
    )

    const formationsDTO:Array<FormationDTOI> = formationsData.map(formation => FormationDTO(formation))
    return formationsDTO
}
export async function getFormation(formationID: Schema.Types.ObjectId){
    const formation = await FormationModel.findById(formationID)
    if(!formation) throw Error('formation-not-found')

    const formationDTO:FormationDTOI = FormationDTO(formation)
    return formationDTO
}

function prepareFormationData(formationData:FormationI){
    const formationDTO = FormationDTO(formationData)

    return formationDTO
}

function validateFormation(formationData:FormationAdd){
    const formationCandidate:FormationAdd = {
        name: formationData.name,
        type: formationData.type,
        counter: 0
    }    

    if(formationData.ref){
        formationCandidate.ref = formationData.ref
        if(!formationData.generation || !formationData.child) throw Error('bad-req')

        formationCandidate.generation = formationData.generation
        formationCandidate.child = formationData.child
    }    

    if(formationData.positions){
        if(formationData.positions.length){
            formationCandidate.positions = formationData.positions.map(position => {
                formationCandidate.counter++
                return {
                    name: position.name,
                    id: formationCandidate.counter
                }
            })
        }
    }

    return formationCandidate
}