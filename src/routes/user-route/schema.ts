import { AlreadyExistError, BadRequestError, AccessDeniedError, InternalServerError, HeadersSchema, UserNotFoundError, UnauthorizedError, WithoutAuthHeaderSchema, RefreshTokenCookieSchema, IDProp } from "../schemas"

const userAuthData = {
    type: 'object',
    properties: {
        password: {
            type: 'string',
            minLength: 4,
            maxLength: 32
        },
        login: {
            type: 'string',
            minLength: 4,
            maxLength: 24,
        }
    }
}
const userBioData = {
    type: 'object',
    properties: {
        firstName: {
            type: 'string',
            maxLength: 80
        },
        lastName: {
            type: 'string',
            maxLength: 80
        },
        patronymic: {
            type: 'string',
            maxLength: 80
        },
        phoneNumbers: {
            type: 'array',
            items: {
                type: 'string',
                minLength: 17,
                maxLength: 17,
                pattern: '^\\+998\\s\\d{2}\\s\\d{3}\\s\\d{2}\\s\\d{2}$'
            },
            minItems: 0,
            uniqueItems: true
        },
        dateOfBirth: {
            type: 'string',
            format: 'date'
        },
        geo: {
            type: 'object',
            properties: {
                countryISO: {
                    type: 'string',
                    pattern: '^[A-Z]{2}$',
                    minLength: 2,
                    maxLength: 2,
                },
                region: {
                    type: 'number'
                }
            },
            required: ['countryISO', 'region']
        },
        PINFL: {
            type: 'string',
            maxLength: 14,
            minLength: 14,
            pattern: '^\\d{14}$'
        },
        passport: {
            type: 'string',
            pattern: '^[A-Z]{2}\\d{7}$',
            maxLength: 9,
            minLength: 9,
        }
    }
}
const userSystemData = {
    type: 'object',
    properties: {
        role: {
            type: 'string',
            enum: ['student', 'enrollee', 'employee', 'teacher']
        },
        permissions: {
            type: 'array',
            items: {
                type: 'string',
                pattern: '^[a-z_]+-[a-z_]+-[a-z_]+$'
            },
            minItems: 1,
            uniqueItems: true
        }
    }
}
const userRolePropertiesData = {
    type: 'object',
    properties: {
        formation:{
            description: 'role: employee & teacher',
            type: 'string',
            format: 'uuid',
            pattern: '^[0-9a-fA-F]{24}$'
        },
        position: {
            description: 'role: employee & teacher',
            type: 'number',
            minimum: 1
        },
        postgraduateEducation: {
            description: 'role: employee & teacher',
            type: 'object',
            properties: {
                status: {
                    type: 'boolean'
                },
                startDate: {
                    type: 'string',
                    format: 'date'
                }
            },
            required: ['status' , 'startDate']
        },
        qualificationIncreasing: {
            description: 'role: employee & teacher',
            type: 'object',
            properties: {
                status: {
                    type: 'boolean'
                },
                startDate: {
                    type: 'string',
                    format: 'date'
                }
            },
            required: ['status' , 'startDate']
        },

        //////

        formOfEducation: {
            description: 'role: enrollee & student',
            type: 'string',
            enum: ['full-time', 'in-absentia', 'magistracy', 'doctoral-studies']
        },
        dateOfAdmission: {
            description: 'role: enrollee & student',
            type: 'string',
            format: 'date'
        },
        specialty: {
            description: 'role: enrollee & student (not formOfEducation: doctoral-studies)',
            type: 'string',
            format: 'uuid',
            pattern: '^[0-9a-fA-F]{24}$'
        },
        group: {
            description: 'role: enrollee & student (not formOfEducation: doctoral-studies)',
            type: 'number',
            minimum: 1
        },
        education: {
            description: 'role: enrollee & student',
            type: 'string',
            enum: ['secondary', 'higher']
        }
    }
}
const userStatusData = {
    type: 'object',
    properties: {
        isDelete: { type: 'boolean', default: false },
        isBlocked: { type: 'boolean', default: false }
    }
}

const userData = {
    type: 'object',
    properties: {
        auth: {...userAuthData, required: ['password', 'login']},
        bio: {...userBioData, required: ['fullName', 'lastName', 'patronymic', 'phoneNumbers', 'dateOfBirth', 'geo', 'PINFL', 'passport']},
        system: {...userSystemData, required: ['role', 'permissions']},
        roleProperties: userRolePropertiesData
    },
    required: ['auth', 'bio', 'system', 'roleProperties']
}

const reqBodyWithID = {
    description: 'Request body data',
    type: 'object',
    properties: {
        data: {
            type: 'object',
            properties: {
                id: IDProp
            },
            required: ['id']
        }
    },
    required: ['data']
}

const usersList = {
    type: 'array',
    items: IDProp,
    minItems: 1,
    uniqueItems: true
}

const reqBodyWithListOfID = {
    description: 'Request body data',
    type: 'object',
    properties: {
        data: {
            type: 'object',
            properties: {
                users: usersList
            },
            required: ['users']
        }
    },
    required: ['data']
}


export const UserSignupSchema = {
    summary: 'Register a new user',
    description: 'Register a new user',
    tags: ['User route'],
    headers: HeadersSchema,
    body: {
        description: 'Request body data',
        type: 'object',
        properties: {
            data: userData
        },
        required: ['data']
    },
    response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer', default: 200 },
            data: {
                type: 'object',
                properties: {
                    user:{
                        type: 'object',
                        properties: {
                            id: IDProp,
                            bio: userBioData,
                            system: userSystemData,
                            roleProperties: userRolePropertiesData,
                            status: userStatusData
                        }
                    }
                }
            }
          }
        },
    
        409: AlreadyExistError,
        400: BadRequestError,
        401: UnauthorizedError,
        403: AccessDeniedError,
        500: InternalServerError
    }
}
export const UsersSignupSchema = {
    summary: 'Multi register users',
    description: 'Register group of new users',
    tags: ['User route'],
    headers: HeadersSchema,
    body: {
        description: 'Request body data',
        type: 'object',
        properties: {
            data: {
                type: 'object',
                properties: {
                    users: {
                        type: 'Array',
                        items: userData,
                        minItems: 1
                    }
                },
                required: ['users']
            }
        },
        required: ['data']
    },
    response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer', default: 200 },
            data: {
                type: 'object',
                properties: {
                    users:{
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: IDProp,
                                bio: userBioData,
                                system: userSystemData,
                                roleProperties: userRolePropertiesData,
                                status: userStatusData
                            }
                        }
                    }
                }
            }
          }
        },
    
        409: AlreadyExistError,
        400: BadRequestError,
        401: UnauthorizedError,
        403: AccessDeniedError,
        500: InternalServerError
    } 
}


export const UserLoginSchema = {
    summary: 'Login',
    description: 'Login (enter to system)',
    tags: ['User route'],
    headers: WithoutAuthHeaderSchema,
    body: {
        description: 'Request parameters',
        type: 'object',
        properties: {
            auth: {
                ...userAuthData,
                required: ['password', 'login']
            }
        },
        required: ['auth']
    },
    response: {
        200: {
          description: 'Successful response (set refresh cookie)',
          type: 'object',
          properties: {
            statusCode: { type: 'integer', default: 200 },
            data: {
                type: 'object',
                properties: {
                    user: {
                        type: 'object',
                        properties: {
                            id: IDProp,
                            bio: userBioData,
                            system: userSystemData,
                            roleProperties: userRolePropertiesData,
                            status: userStatusData
                        }
                    },
                    accessToken: {
                        type: 'string'
                    },
                    refreshToken: {
                        type: 'string'
                    }
                }
            }
          }
        },
    
        404: UserNotFoundError,
        400: BadRequestError,
        500: InternalServerError
    }
}
export const UserLogoutSchema = {
    summary: 'Logout',
    description: 'Logout (exit from system)',
    tags: ['User route'],
    headers: HeadersSchema,
    body: reqBodyWithID,
    response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer', default: 200 },
            data: {
                type: 'object',
                properties: {
                    token: {
                        type: 'number'
                    }
                }
            }
          }
        },
    
        404: UserNotFoundError,
        400: BadRequestError,
        401: UnauthorizedError,
        403: AccessDeniedError,
        500: InternalServerError
    }
}
export const UserRefreshSchema = {
    summary: 'Refresh',
    description: 'Refresh token',
    tags: ['User route'],
    headers: WithoutAuthHeaderSchema,
    cookies: RefreshTokenCookieSchema,
    body: reqBodyWithID,
    response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer', default: 200 },
            data: {
                type: 'object',
                properties: {
                    token: {
                        type: 'number'
                    }
                }
            }
          }
        },
    
        404: UserNotFoundError,
        400: BadRequestError,
        500: InternalServerError
    }
}


export const UserDeleteSchema = {
    summary: 'Delete',
    description: 'Delete user',
    tags: ['User route'],
    headers: HeadersSchema,
    body: reqBodyWithID,
    response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer', default: 200 },
            data: {
                type: 'object',
                properties: {
                    OK: {
                        type: 'boolean',
                        default: true
                    },
                    params: {
                        type: 'object',
                        properties: {
                            matchedCount: {
                                type: 'number',
                            }
                        }
                    }
                }
            }
          }
        },
    
        404: UserNotFoundError,
        400: BadRequestError,
        401: UnauthorizedError,
        403: AccessDeniedError,
        500: InternalServerError
    }   
}
export const UsersDeleteSchema = {
    summary: 'Multi delete',
    description: 'Delete list of users',
    tags: ['User route'],
    headers: HeadersSchema,
    body: reqBodyWithListOfID,
    response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer', default: 200 },
            data: {
                type: 'object',
                properties: {
                    OK: {
                        type: 'boolean',
                        default: true
                    },
                    params: {
                        type: 'object',
                        properties: {
                            matchedCount: {
                                type: 'number',
                            }
                        }
                    }
                }
            }
          }
        },
    
        404: UserNotFoundError,
        400: BadRequestError,
        401: UnauthorizedError,
        403: AccessDeniedError,
        500: InternalServerError
    }   
}


export const UserDestroySchema = {
    summary: 'Destroy',
    description: 'Destroy user',
    tags: ['User route'],
    headers: HeadersSchema,
    body: reqBodyWithID,
    response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer', default: 200 },
            data: {
                type: 'object',
                properties: {
                    OK: {
                        type: 'boolean',
                        default: true
                    },
                    params: {
                        type: 'object',
                        properties: {
                            matchedCount: {
                                type: 'number',
                            }
                        }
                    }
                }
            }
          }
        },
    
        404: UserNotFoundError,
        400: BadRequestError,
        401: UnauthorizedError,
        403: AccessDeniedError,
        500: InternalServerError
    }   
}
export const UsersDestroySchema = {
    summary: 'Multi destroy',
    description: 'Destroy list of users',
    tags: ['User route'],
    headers: HeadersSchema,
    body: reqBodyWithListOfID,
    response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer', default: 200 },
            data: {
                type: 'object',
                properties: {
                    OK: {
                        type: 'boolean',
                        default: true
                    },
                    params: {
                        type: 'object',
                        properties: {
                            matchedCount: {
                                type: 'number',
                            }
                        }
                    }
                }
            }
          }
        },
    
        404: UserNotFoundError,
        400: BadRequestError,
        401: UnauthorizedError,
        403: AccessDeniedError,
        500: InternalServerError
    }   
}


export const UserBlockSchema = {
    summary: 'Block',
    description: 'Block user',
    tags: ['User route'],
    headers: HeadersSchema,
    body: reqBodyWithID,
    response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer', default: 200 },
            data: {
                type: 'object',
                properties: {
                    OK: {
                        type: 'boolean',
                        default: true
                    },
                    params: {
                        type: 'object',
                        properties: {
                            matchedCount: {
                                type: 'number',
                            }
                        }
                    }
                }
            }
          }
        },
    
        404: UserNotFoundError,
        400: BadRequestError,
        401: UnauthorizedError,
        403: AccessDeniedError,
        500: InternalServerError
    }   
}
export const UsersBlockSchema = {
    summary: 'Multi block',
    description: 'Block list of users',
    tags: ['User route'],
    headers: HeadersSchema,
    body: reqBodyWithListOfID,
    response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer', default: 200 },
            data: {
                type: 'object',
                properties: {
                    OK: {
                        type: 'boolean',
                        default: true
                    },
                    params: {
                        type: 'object',
                        properties: {
                            matchedCount: {
                                type: 'number',
                            }
                        }
                    }
                }
            }
          }
        },
    
        404: UserNotFoundError,
        400: BadRequestError,
        401: UnauthorizedError,
        403: AccessDeniedError,
        500: InternalServerError
    }   
}

export const EditUserSchema = {
    summary: 'Edit user',
    description: 'Edit user properties',
    tags: ['User route'],
    headers: HeadersSchema,
    body: {
        description: 'Request body data',
        type: 'object',
        properties: {
            data: {
                type: 'object',
                properties: {
                    user: {
                        type: 'object',
                        properties: {
                            id: IDProp,

                            auth: userAuthData,
                            bio: userBioData,
                            system: userSystemData,
                            roleProperties: userRolePropertiesData
                        },
                        required: ['id']
                    }
                },
                required: ['user']
            }
        },
        required: ['data']
    },
    response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer', default: 200 },
            data: {
                type: 'object',
                properties: {
                    OK: {
                        type: 'boolean',
                        default: true
                    },
                    user: {
                        type: 'object',
                        properties: {
                            id: IDProp,
                            bio: userBioData,
                            system: userSystemData,
                            roleProperties: userRolePropertiesData,
                            status: userStatusData
                        }
                    }
                }
            }
          }
        },
    
        400: BadRequestError,
        401: UnauthorizedError,
        403: AccessDeniedError,
        500: InternalServerError
    }
}
export const EditUsersSchema = {
    summary: 'Edit users',
    description: 'Edit list of users properties',
    tags: ['User route'],
    headers: HeadersSchema,
    body: {
        description: 'Request body data',
        type: 'object',
        properties: {
            data: {
                type: 'object',
                properties: {
                    users: usersList,
                    properties: {
                        type: 'object',
                        properties: {
                            system: {
                                type: 'object',
                                properties: {
                                    role: {
                                        type: 'string',
                                        enum: ['student', 'enrollee', 'employee', 'teacher']
                                    }
                                }
                            },
                            roleProperties: {
                                type: 'object',
                                properties: {
                                    formation:{
                                        description: 'role: employee & teacher',
                                        type: 'string',
                                        format: 'uuid',
                                        pattern: '^[0-9a-fA-F]{24}$'
                                    },
                                    position: {
                                        description: 'role: employee & teacher',
                                        type: 'number',
                                        minimum: 1
                                    },
                            
                                    //////
                            
                                    formOfEducation: {
                                        description: 'role: enrollee & student',
                                        type: 'string',
                                        enum: ['full-time', 'in-absentia', 'magistracy', 'doctoral-studies']
                                    },
                                    dateOfAdmission: {
                                        description: 'role: enrollee & student',
                                        type: 'string',
                                        format: 'date'
                                    },
                                    specialty: {
                                        description: 'role: enrollee & student (not formOfEducation: doctoral-studies)',
                                        type: 'string',
                                        format: 'uuid',
                                        pattern: '^[0-9a-fA-F]{24}$'
                                    },
                                    group: {
                                        description: 'role: enrollee & student (not formOfEducation: doctoral-studies)',
                                        type: 'number',
                                        minimum: 1
                                    },
                                    education: {
                                        description: 'role: enrollee & student',
                                        type: 'string',
                                        enum: ['secondary', 'higher']
                                    }
                                }
                            }
                        },
                        required: ['id']
                    }
                },
                required: ['user']
            }
        },
        required: ['data']
    },
    response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer', default: 200 },
            data: {
                type: 'object',
                properties: {
                    OK: {
                        type: 'boolean',
                        default: true
                    },
                    params: {
                        type: 'object',
                        properties: {
                            matchedCount: {
                                type: 'number',
                            }
                        }
                    }
                }
            }
          }
        },
    
        400: BadRequestError,
        401: UnauthorizedError,
        403: AccessDeniedError,
        500: InternalServerError
    } 
}


export const GetAllUsersSchema = {
    summary: 'Get full users list',
    description: 'Get all users from DB',
    tags: ['User route'],
    headers: HeadersSchema,
    response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer', default: 200 },
            data: {
                type: 'object',
                properties: {
                    users: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: IDProp,
                                bio: userBioData,
                                system: userSystemData,
                                roleProperties: userRolePropertiesData,
                                status: userStatusData
                            }
                        }
                    }
                }
            }
          }
        },
    
        404: UserNotFoundError,
        400: BadRequestError,
        401: UnauthorizedError,
        403: AccessDeniedError,
        500: InternalServerError
    }
}
export const GetUsersSchema = {
    summary: 'Get custom users list',
    description: 'Get users list from DB by ID from query param',
    tags: ['User route'],
    headers: HeadersSchema,
    querystring: {
        type: 'object',
        properties: {
            users: {
                type: 'array',
                items: {
                    type: 'string',
                    format: 'uuid'
                },
                minItems: 1,
                uniqueItems: true
            }
        },
        required: ['users']
    },
    response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer', default: 200 },
            data: {
                type: 'object',
                properties: {
                    users: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: IDProp,
                                bio: userBioData,
                                system: userSystemData,
                                roleProperties: userRolePropertiesData,
                                status: userStatusData
                            }
                        }
                    }
                }
            }
          }
        },
    
        404: UserNotFoundError,
        400: BadRequestError,
        401: UnauthorizedError,
        403: AccessDeniedError,
        500: InternalServerError
    }
}
export const GetUserSchema = {
    summary: 'Get user data',
    description: 'Get user data from DB by ID from query param',
    tags: ['User route'],
    headers: HeadersSchema,
    querystring: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                format: 'uuid'
            }
        },
        required: ['id']
    },
    response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            statusCode: { type: 'integer', default: 200 },
            data: {
                type: 'object',
                properties: {
                    user: {
                        type: 'object',
                        properties: {
                            id: IDProp,
                            bio: userBioData,
                            system: userSystemData,
                            roleProperties: userRolePropertiesData,
                            status: userStatusData
                        }
                    }
                }
            }
          }
        },
    
        404: UserNotFoundError,
        400: BadRequestError,
        401: UnauthorizedError,
        403: AccessDeniedError,
        500: InternalServerError
    }
}