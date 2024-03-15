declare interface UserI{
    _id: import('mongoose').Schema.Types.ObjectId,
    auth: UserAuth,
    bio: UserBio,
    system: UserSystem,
    status: UserStatus,
    roleProperties: StudentRoleProperties | StaffRoleProperties,
}

declare interface UserIDoc extends UserI, DocumentExC{
    comparePasswords(hashedPassword: string, candidatePassword: string): boolean
}

declare interface UserModelI extends ModelExC<UserIDoc> {
}

declare interface UserAuth {
    password: string,
    login: string
}

declare interface UserBio {
    firstName: string,
    lastName: string,
    patronymic: string,
    phoneNumbers: Array<string>,
    dateOfBirth: Date,
    geo: {
        countryISO: ShortListOfISOCountryCodes,
        region: number
    },
    passport: string,
    PINFL: string
}

declare interface UserSystem {
    role: import('./enums').UserRoles,
    permissions: Array<import('./enums').UserPermissions>
}

declare interface UserStatus {
    isDeleted: boolean,
    isBlocked: boolean
}

declare interface StudentRoleProperties {
    formOfEducation: import('./enums').StudentEducationForms,
    dateOfAdmission: Date,
    specialty?: import('mongoose').Schema.Types.ObjectId,
    group?: number,
    education?: import('./enums').StudentEducationLevels
}
declare interface StaffRoleProperties {
    formation: import('mongoose').Schema.Types.ObjectId,
    position: number,
    postgraduateEducation: StaffExtraEducationProperties,
    qualificationIncreasing: StaffExtraEducationProperties
}

interface StaffExtraEducationProperties {
    isActive: boolean,
    date: null | Date
}