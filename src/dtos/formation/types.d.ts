declare interface FormationDTOI extends Pick<FormationI, "name" | "type">, Partial<Pick<FormationI, "ref" | "generation" | "child">>{
    id: import('mongoose').Schema.Types.ObjectId
}