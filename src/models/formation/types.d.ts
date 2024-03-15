declare interface FormationI{
    _id: import('mongoose').Schema.Types.ObjectId,
    name: Array<InternationalNameValue>,
    type: import('./enums').FormationTypes,
    positions: Array<FormationPosition>,
    ref?: import('mongoose').Schema.Types.ObjectId,
    generation?: number,
    child?: number
}

declare interface FormationIDoc extends FormationI, DocumentExC{
}

declare interface FormationModelI extends ModelExC<FormationIDoc> {
}

declare interface FormationPosition {
    id: number,
    name: Array<InternationalNameValue>
}