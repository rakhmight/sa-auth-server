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
    
    GetAllFormations = 'sa-auth-get_all_formations', // get all formations list
    GetFormations = 'sa-auth-get_formations', // get formations list
    GetFormation = 'sa-auth-get_formation', // get formations data



    // SPECIALTY'S


    // SYSTEMS
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