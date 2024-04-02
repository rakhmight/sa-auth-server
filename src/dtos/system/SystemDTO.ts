export default function(system:SystemI):SystemDTOI{
    const SystemDTO:SystemDTOI = {
        id: system._id,
        name: system.name,
        type: system.type,
        login: system.login,
        IP4Address: system.IP4Address,
        receiveNotifications: system.receiveNotifications
    }

    return SystemDTO
}