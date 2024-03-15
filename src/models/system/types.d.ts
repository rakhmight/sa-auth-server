declare interface SystemI{
    _id: import('mongoose').Schema.Types.ObjectId,
    login: string, // for client = HMAC-address
    name: Array<InternationalNameValue>,
    token: string,
    type: import('./enums').SystemType,
    IP4Address: string
}

declare interface SystemIDoc extends SystemI, DocumentExC{
}

declare interface SystemModelI extends ModelExC<SystemIDoc> {
}