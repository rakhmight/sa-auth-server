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

// declare type EditableUserProperties = DeepPartial<Omit<UserI, '_id' | 'status'>> & UserID
declare interface EditableUserProperties extends DeepPartial<Omit<UserI, '_id' | 'status' | 'system'>>, UserID, Partial<Pick<UserI, 'system'>> {

}
declare type EditableUsersProperties = DeepPartial<EditableUsersPropertiesI>

declare interface UpdatableUserProperties {
    'auth.login': UserI['auth']['login'],
    'auth.password': UserI['auth']['password'],
    'bio.PINFL': UserI['bio']['PINFL'],
    'bio.passport': UserI['bio']['passport'],
    'bio.dateOfBirth': UserI['bio']['dateOfBirth'],
    'bio.firstName': UserI['bio']['firstName'],
    'bio.lastName': UserI['bio']['lastName'],
    'bio.patronymic': UserI['bio']['patronymic'],
    'bio.geo.countryISO': UserI['bio']['geo']['countryISO'],
    'bio.geo.region': UserI['bio']['geo']['region'],
    'system.role': UserI['system']['role'],
    'system.permissions': UserI['system']['permissions'],
    'roleProperties.formation': UserI['roleProperties']['formation'],
    'roleProperties.position': UserI['roleProperties']['position'],
    'roleProperties.postgraduateEducation.date': UserI['roleProperties']['postgraduateEducation']['date'],
    'roleProperties.postgraduateEducation.isActive': UserI['roleProperties']['postgraduateEducation']['isActive'],
    'roleProperties.qualificationIncreasing.date': UserI['roleProperties']['qualificationIncreasing']['date'],
    'roleProperties.qualificationIncreasing.isActive': UserI['roleProperties']['qualificationIncreasing']['isActive'],
    'roleProperties.dateOfAdmission': UserI['roleProperties']['dateOfAdmission'],
    'roleProperties.education': UserI['roleProperties']['education'],
    'roleProperties.formOfEducation': UserI['roleProperties']['formOfEducation'],
    'roleProperties.specialty': UserI['roleProperties']['specialty'],
    'roleProperties.group': UserI['roleProperties']['group'],
}

declare type UpdatableUsersProperties = Pick<UpdatableUserProperties, 'system.role' | 'roleProperties.dateOfAdmission' | 'roleProperties.education' | 'roleProperties.formOfEducation' | 'roleProperties.group' | 'roleProperties.specialty' | 'roleProperties.formation' | 'roleProperties.position'>

declare interface EditUser {
    user: EditableUserProperties
}

declare interface EditUsers {
    users: Array<import('mongoose').Schema.Types.ObjectId>
    properties: EditableUsersProperties
}