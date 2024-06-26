import { BadRequestError, AccessDeniedError, InternalServerError, HeadersSchema, UnauthorizedError, NotFoundError, nameProp, IDProp } from "../schemas"

const specialtyData = {
    name: nameProp,
    ref: IDProp,
}

export const AddSpecialtySchema = {
    summary: 'Add a new specialty',
    description: 'Add a new specialty',
    tags: ['Specialty route'],
    headers: HeadersSchema,
    body: {
        description: 'Request body data',
        type: 'object',
        properties: {
            data: {
                type: 'object',
                properties: specialtyData,
                required: ['name', 'ref']
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
                            ...specialtyData
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
export const AddSpecialtiesSchema = {
    summary: 'Add a new specialties',
    description: 'Add group of new specialties',
    tags: ['Specialty route'],
    headers: HeadersSchema,
    body: {
        description: 'Request body data',
        type: 'object',
        properties: {
            data: {
                type: 'object',
                properties: {
                    specialties: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: specialtyData,
                            required: ['name', 'ref']
                        },
                        minItems: 1
                    }
                },
                required: ['specialties']
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
                    specialties:{
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: IDProp,
                                ...specialtyData
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

export const DeleteSpecialtySchema = {
    summary: 'Delete',
    description: 'Delete specialty',
    tags: ['Specialty route'],
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
export const DeleteSpecialtiesSchema = {
    summary: 'Multi delete',
    description: 'Delete list of specialties',
    tags: ['Specialty route'],
    headers: HeadersSchema,
    body: {
        description: 'Request body data',
        type: 'object',
        properties: {
            data: {
                type: 'object',
                properties:{
                    specialties: {
                        type: 'array',
                        items: IDProp,
                        minItems: 1,
                        uniqueItems: true
                    }
                },
                required: ['specialties']
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

export const EditSpecialtySchema = {
    summary: 'Edit specialty',
    description: 'Edit specialty properties',
    tags: ['Specialty route'],
    headers: HeadersSchema,
    body: {
        description: 'Request body data',
        type: 'object',
        properties: {
            data: {
                type: 'object',
                properties:{
                    id: IDProp,
                    ...specialtyData
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
                    specialty: {
                        type: 'object',
                        properties: {
                            id: IDProp,
                            ...specialtyData
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

export const GetAllSpecialtiesSchema = {
    summary: 'Get full specialties list',
    description: 'Get all specialties from DB',
    tags: ['Specialty route'],
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
                    specialties: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: IDProp,
                                ...specialtyData
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
export const GetSpecialtiesSchema = {
    summary: 'Get custom specialties list',
    description: 'Get specialties list from DB by ID from query param',
    tags: ['Specialty route'],
    headers: HeadersSchema,
    querystring: {
        type: 'object',
        properties: {
            specialties: {
                type: 'array',
                items: IDProp,
                minItems: 1,
                uniqueItems: true
            }
        },
        required: ['specialties']
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
                                ...specialtyData
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
export const GetSpecialtySchema = {
    summary: 'Get specialty data',
    description: 'Get specialty data from DB by ID from query param',
    tags: ['Specialty route'],
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
                    specialty: {
                        type: 'object',
                        properties: {
                            id: IDProp,
                            ...specialtyData
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