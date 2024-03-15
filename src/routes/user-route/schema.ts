import { AlreadyExistError, BadRequestError, AccessDeniedError, InternalServerError, HeadersSchema, UserNotFoundError, UnauthorizedError, WithoutAuthHeaderSchema, RefreshTokenCookieSchema } from "../schemas"

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
    },
    required: ['password', 'login']
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
    },
    required: ['fullName', 'lastName', 'patronymic', 'phoneNumbers', 'dateOfBirth', 'geo', 'PINFL', 'passport']
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
    },
    required: ['role', 'permissions']
}
const userRolePropertiesData = {
    type: 'object',
    properties: {
        formation:{
            type: 'string',
            format: 'uuid',
            pattern: '^[0-9a-fA-F]{24}$'
        },
        position: {
            type: 'number',
            minimum: 1
        },
        postgraduateEducation: {
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
            type: 'string',
            enum: ['full-time', 'in-absentia', 'magistracy', 'doctoral-studies']
        },
        dateOfAdmission: {
            type: 'string',
            format: 'date'
        },
        specialty: {
            type: 'string',
            format: 'uuid',
            pattern: '^[0-9a-fA-F]{24}$'
        },
        group: {
            type: 'number',
            minimum: 1
        },
        education: {
            type: 'string',
            enum: ['secondary', 'higher']
        }
    }
}
const userID = {
    type: 'string',
    format: 'uuid',
    pattern: '^[0-9a-fA-F]{24}$'
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
        auth: userAuthData,
        bio: userBioData,
        system: userSystemData,
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
                id: userID
            },
            required: ['id']
        }
    },
    required: ['data']
}

const resMatchedData = {
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
                            id: userID,
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

export const UserLoginSchema = {
    summary: 'Login',
    description: 'Login (enter to system)',
    tags: ['User route'],
    headers: WithoutAuthHeaderSchema,
    body: {
        description: 'Request parameters',
        type: 'object',
        properties: {
            auth: userAuthData
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
                            id: userID,
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
            data: resMatchedData
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
    
}

export const GetAllUsersSchema = {
    
}