export default function(specialty:SpecialtyI):SpecialtyDTOI{
    const SpecialtyDTO:SpecialtyDTOI = {
        id: specialty._id,
        name: specialty.name,
        ref: specialty.ref
    }

    return SpecialtyDTO
}