export enum UserRoles {
    Student = 'student',
    Enrollee = 'enrollee',
    Teacher = 'teacher',
    Employee = 'employee'
}

export enum UserPermissions {
    AuthUse = 'sa-auth-use', // use system

    
    // USERS
    AuthSignup = 'sa-auth-signup', // signup
    AuthSignupUsers = 'sa-auth-signup_users', // signup []
    AuthLogout = 'sa-auth-logout', // logout

    AuthEditUser = 'sa-auth-edit_user', // edit user data
    AuthEditUsers = 'sa-auth-edit_users', // edit users data []

    AuthDeleteUser = 'sa-auth-delete_user', // delete user
    AuthDeleteUsers = 'sa-auth-delete_users', // delete users []

    AuthDestroyUser = 'sa-auth-destroy_user', // destroy user data
    AuthDestroyUsers = 'sa-auth-destroy_users', // destroy users data []

    AuthBlockUser = 'sa-auth-block_user', // block user
    AuthBlockUsers = 'sa-auth-block_users', // block users

    AuthGetUser = 'sa-auth-get_user', // get user
    AuthGetAllUsers = 'sa-auth-get_all_users', // get all users list
    AuthGetUsers = 'sa-auth-get_users', // get users list


    // FORMATIONS
    AuthAddFormation = 'sa-auth-add_formation', // add formation
    AuthAddFormations = 'sa-auth-add_formations', // add formations []
    AuthAddFormationPositions = 'sa-auth-add_formations_positions', // add positions to formation []

    AuthDeleteFormation = 'sa-auth-delete_formation', // delete formation
    AuthDeleteFormations = 'sa-auth-delete_formations', // delete formations []
    AuthDeleteFormationPositions = 'sa-auth-delete_formations_positions', // delete formation positions []

    AuthEditFormation = 'sa-auth-edit_formation', // edit formation
    AuthEditFormationPosition = 'sa-auth-edit_formation_position', // edit formation position
    
    AuthGetAllFormations = 'sa-auth-get_all_formations', // get all formations list
    AuthGetFormations = 'sa-auth-get_formations', // get formations list
    AuthGetFormation = 'sa-auth-get_formation', // get formations data



    // SPECIALTIES
    AuthAddSpecialty = 'sa-auth-add_specialty', // add specialty
    AuthAddSpecialties = 'sa-auth-add_specialties', // add specialties []

    AuthDeleteSpecialty = 'sa-auth-delete_specialty', // delete specialty
    AuthDeleteSpecialties = 'sa-auth-delete-specialties', // delete specialties []

    AuthEditSpecialty = 'sa-auth-edit_specialty', // edit specialty

    AuthGetAllSpecialties = 'sa-auth-get_all_specialties', // get all specialties list
    AuthGetSpecialties = 'sa-auth-get-specialties', // get specialties list
    AuthGetSpecialty = 'sa-auth-specialty', // get specialty data


    // SYSTEMS
    AuthAddSystem = 'sa-auth-add_system', // add system
    AuthAddSystems = 'sa-auth-add_systems', // add systems []

    AuthRefreshSystemToken = 'sa-auth-refresh_system_token', // refresh system token

    AuthDeleteSystem = 'sa-auth-delete_system', // delete system
    AuthDeleteSystems = 'sa-auth-delete_systems', // delete systems []

    AuthEditSystem = 'sa-auth-edit_system', // edit system
    AuthGetAllSystems = 'sa-auth-get_all_systems', // get all systems list
    AuthGetSystems = 'sa-auth-get-systems', // get systems list
    AuthGetSystem = 'sa-auth-get-system' // get system
}

export enum StudentEducationForms {
    FullTime = 'full-time',
    InAbsentia = 'in-absentia',
    Magistracy = 'magistracy',
    DoctoralStudies = 'doctoral-studies'
}

export enum StudentEducationLevels {
    Secondary = 'secondary',
    Higher = 'higher'
}