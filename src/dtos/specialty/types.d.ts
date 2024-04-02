declare interface SpecialtyDTOI extends Pick<SpecialtyI, "name" | "ref">{
    id: import('mongoose').Schema.Types.ObjectId
}