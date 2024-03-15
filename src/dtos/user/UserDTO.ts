export default function(user:UserI):UserDTOI{
    const userDTO:UserDTOI = {
        id: user._id,
        bio: user.bio,
        system: user.system,
        roleProperties: user.roleProperties,
        status: user.status
    }

    return userDTO
}