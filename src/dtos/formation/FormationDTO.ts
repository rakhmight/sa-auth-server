export default function(formation:FormationI):FormationDTOI{
    const FormationDTO:FormationDTOI = {
        id: formation._id,
        name: formation.name,
        type: formation.type
    }

    if(formation.ref) FormationDTO.ref = formation.ref
    if(formation.generation) FormationDTO.generation = formation.generation
    if(formation.child) FormationDTO.child = formation.child

    return FormationDTO
}