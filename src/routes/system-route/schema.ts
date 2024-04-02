import { BadRequestError, AccessDeniedError, InternalServerError, HeadersSchema, UnauthorizedError, NotFoundError, nameProp, IDProp } from "../schemas"

const systemData = {
    name: nameProp,
    login: {
        type: 'string',
        pattern: '^[a-z]{2}-[a-z]+((-[a-z]+)+)?$'
    },
    type: {
        type: 'string',
        enum: ['server', 'client']
    },
    IP4Address: {
        type: 'string',
        pattern: '^((((http|https):\/\/)?((25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|[0-1]?[0-9]?[0-9])(:[0-9][0-9][0-9][0-9])?)|(((http|https):\/\/)?((www\.([a-zA-Z0-9\-]{2,63}\.)+[a-zA-Z]{2,63})|(([a-zA-Z0-9\-]{2,63}\.)+[a-zA-Z]{2,63}))(\.[a-zA-Z]{2,63})?))$'
    },
    receiveNotifications: {
        type: 'boolean'
    }
}

const systemToken = {
    type: 'string',
    minLength: 36,
    maxLength: 36
}

export const AddSystemSchema = {
    summary: 'Add a new system',
    description: 'Add a new system',
    tags: ['System route'],
    headers: HeadersSchema,
    body: {
        description: 'Request body data',
        type: 'object',
        properties: {
            data: {
                type: 'object',
                properties: systemData,
                required: ['name', 'login', 'type', 'IP4Address', 'receiveNotifications']
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
                    specialty:{
                        type: 'object',
                        properties: {
                            id: IDProp,
                            token: systemToken,
                            ...systemData
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
export const AddSystemsSchema = {
    summary: 'Add a new systems',
    description: 'Add group of new systems',
    tags: ['System route'],
    headers: HeadersSchema,
    body: {
        description: 'Request body data',
        type: 'object',
        properties: {
            data: {
                type: 'object',
                properties: {
                    systems: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: systemData,
                            required: ['name', 'login', 'type', 'IP4Address', 'receiveNotifications']
                        },
                        minItems: 1
                    }
                },
                required: ['systems']
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
                    systems:{
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: IDProp,
                                token: systemToken,
                                ...systemData
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

export const RefreshSystemTokenSchema = {
    summary: 'Refresh token',
    description: 'Refresh system token',
    tags: ['System route'],
    headers: HeadersSchema,
    body: {
        description: 'Request body data',
        type: 'object',
        properties: {
            data: {
                type: 'object',
                properties:{
                    id: IDProp
                },
                required: ['id']
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
                    system: {
                        type: 'object',
                        properties: {
                            id: IDProp,
                            ...systemData
                        }
                    }
                }
            }
          }
        },
    
        400: BadRequestError,
        401: UnauthorizedError,
        403: AccessDeniedError,
        404: NotFoundError,
        500: InternalServerError
    }
}

export const DeleteSystemSchema = {
    summary: 'Delete',
    description: 'Delete system',
    tags: ['System route'],
    headers: HeadersSchema,
    body: {
        description: 'Request body data',
        type: 'object',
        properties: {
            data: {
                type: 'object',
                properties:{
                    id: IDProp
                },
                required: ['id']
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
        404: NotFoundError,
        500: InternalServerError
    }
}
export const DeleteSystemsSchema = {
    summary: 'Multi delete',
    description: 'Delete list of systems',
    tags: ['System route'],
    headers: HeadersSchema,
    body: {
        description: 'Request body data',
        type: 'object',
        properties: {
            data: {
                type: 'object',
                properties:{
                    systems: {
                        type: 'array',
                        items: IDProp,
                        minItems: 1,
                        uniqueItems: true
                    }
                },
                required: ['systems']
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
        404: NotFoundError,
        500: InternalServerError
    }
}

export const EditSystemSchema = {
    summary: 'Edit system',
    description: 'Edit system properties',
    tags: ['System route'],
    headers: HeadersSchema,
    body: {
        description: 'Request body data',
        type: 'object',
        properties: {
            data: {
                type: 'object',
                properties:{
                    id: IDProp,
                    ...systemData
                },
                required: ['id']
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
                    system: {
                        type: 'object',
                        properties: {
                            id: IDProp,
                            ...systemData
                        }
                    }
                }
            }
          }
        },
    
        400: BadRequestError,
        401: UnauthorizedError,
        403: AccessDeniedError,
        404: NotFoundError,
        500: InternalServerError
    }
}

export const GetAllSystemsSchema = {
    summary: 'Get full systems list',
    description: 'Get all systems from DB',
    tags: ['System route'],
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
                    systems: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: IDProp,
                                ...systemData
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
export const GetSystemsSchema = {
    summary: 'Get custom systems list',
    description: 'Get systems list from DB by ID from query param',
    tags: ['System route'],
    headers: HeadersSchema,
    querystring: {
        type: 'object',
        properties: {
            systems: {
                type: 'array',
                items: IDProp,
                minItems: 1,
                uniqueItems: true
            }
        },
        required: ['systems']
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
                    specialties: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: IDProp,
                                ...systemData
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
export const GetSystemSchema = {
    summary: 'Get system data',
    description: 'Get system data from DB by ID from query param',
    tags: ['System route'],
    headers: HeadersSchema,
    querystring: {
        type: 'object',
        properties: {
            id: IDProp
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
                    system: {
                        type: 'object',
                        properties: {
                            id: IDProp,
                            ...systemData
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