declare type UserSignup = Omit<UserI, "_id" | "status">

declare interface UserLogin {
    auth: {
        login: string,
        password: string
    }   
}

declare interface UserID {
    id: import('mongoose').Schema.Types.ObjectId
}

declare interface EditUsers {
    
}