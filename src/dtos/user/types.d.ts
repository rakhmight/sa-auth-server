declare interface UserDTOI extends Omit<UserI, "_id" | "auth">{
    id: import('mongoose').Schema.Types.ObjectId
}