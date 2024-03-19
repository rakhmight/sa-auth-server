declare type FormationAdd = Pick<FormationI, "name" | "type"> & Partial<Pick<FormationI, "positions" | "ref" | "generation" | "child">>

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

declare interface FormationEdit {

}

declare interface FormationPositionEdit {

}