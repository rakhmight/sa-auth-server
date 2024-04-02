declare type SpecialtyAdd = Pick<SpecialtyI, "name" | "ref">
declare interface SpecialtiesAdd {
    specialties: Array<SpecialtyAdd>
}

declare interface SpecialtyID {
    id: import('mongoose').Schema.Types.ObjectId
}

declare interface ArrayOfSpecialtiesID {
    specialties: Array<import('mongoose').Schema.Types.ObjectId>
}


declare interface SpecialtyEdit extends SpecialtyID, Partial<Pick<SpecialtyI, "ref" | "name">>{}