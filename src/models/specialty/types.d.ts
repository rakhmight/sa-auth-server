declare interface SpecialtyI{
    _id: import('mongoose').Schema.Types.ObjectId,
    name: Array<InternationalNameValue>,
    ref: import('mongoose').Schema.Types.ObjectId
}

declare interface SpecialtyIDoc extends SpecialtyI, DocumentExC{
}

declare interface SpecialtyModelI extends ModelExC<SpecialtyIDoc> {
}