declare type SystemAdd = Omit<SystemI, "_id" | "token">
declare interface SystemsAdd {
    systems: Array<SystemAdd>
}

declare interface SystemID {
    id: import('mongoose').Schema.Types.ObjectId
}

declare interface ArrayOfSystemsID {
    systems: Array<import('mongoose').Schema.Types.ObjectId>
}


declare interface SystemEdit extends SystemID, Partial<Omit<SystemI, "_id" | "token">>{}