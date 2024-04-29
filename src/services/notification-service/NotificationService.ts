import { SystemModel } from "../../models/system/SystemModel"

enum NotificationType {
    AddUsers = 'add-users',
    UpdateUsers = 'update-users',
    BlockUsers = 'block-users',
    DeleteUsers = 'delete-users',
    RefreshUsers = 'refresh-users',

    AddFormations = 'add-formations',
    UpdateFormations = 'update-formations',
    DeleteFormations = 'delete-formations',

    AddSpecialties = 'add-specialties',
    UpdateSpecialties = 'update-specialties',
    DeleteSpecialties = 'delete-specialties'
}

export async function notificationSystems(data:never, type:NotificationType){
    // /api/v1/notifications/auth-add-users

    // prepared data

    // send data
}