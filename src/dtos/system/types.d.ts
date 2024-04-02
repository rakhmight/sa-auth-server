declare interface SystemDTOI extends Pick<SystemI, "name" | "type" | "login" | "IP4Address" | "receiveNotifications">{
    id: import('mongoose').Schema.Types.ObjectId
}