declare type FormationAdd = Pick<FormationI, "name" | "type" | "counter"> & Partial<Pick<FormationI, "positions" | "ref" | "generation" | "child">>
declare interface FormationsAdd {
    formations: Array<FormationAdd>
}

declare interface FormationID {
    id: import('mongoose').Schema.Types.ObjectId
}

declare interface ArrayOfFormationsID {
    formations: Array<import('mongoose').Schema.Types.ObjectId>
}

declare interface FormationPositionsAdd extends FormationID{
    positions: Array<FormationPosition>
}

declare interface FormationPositionsDelete extends FormationID{
    positions: Array<FormationPositionID>
}

declare interface FormationEdit extends FormationID, Partial<Pick<FormationI, "ref" | "generation" | "child" | "name" | "type">>{}

declare interface FormationPositionEdit extends FormationID{
    position: FormationPosition
}