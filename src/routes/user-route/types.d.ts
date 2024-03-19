declare type UserSignup = Omit<UserI, "_id" | "status">

declare interface UsersSignup {
    users: Array<UserSignup>
}

declare interface UserLogin {
    auth: {
        login: string,
        password: string
    }   
}

declare interface UserID {
    id: import('mongoose').Schema.Types.ObjectId
}

declare interface ArrayOfUsersID {
    users: Array<import('mongoose').Schema.Types.ObjectId>
}

interface EditableUsersPropertiesI{
    roleProperties: StudentRoleProperties & Pick<StaffRoleProperties, 'formation' | 'position'>
    system: {
        role: import('../../models/user/enums').UserRoles
    }
}

declare type EditableUserProperties = DeepPartial<Omit<UserI, '_id' | 'status'>> & UserID
declare type EditableUsersProperties = DeepPartial<EditableUsersPropertiesI>

declare interface EditUser {
    user: EditableUserProperties
}

declare interface EditUsers {
    users: Array<import('mongoose').Schema.Types.ObjectId>
    properties: EditableUsersProperties
}