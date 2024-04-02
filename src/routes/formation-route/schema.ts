import { BadRequestError, AccessDeniedError, InternalServerError, HeadersSchema, UnauthorizedError, NotFoundError, nameProp, IDProp } from "../schemas"

const formationPositions = {
    type: 'array',
    items: {
        type: 'object',
        properties: {
            name: nameProp
        },
        required: ['name']
    },
    minItems: 1
}

const formationData = {
    name: nameProp,
    type: {
        type: 'string',
        enum: ['lead', 'administration', 'center', 'department', 'branch', 'group', 'squad', 'unit', 'service', 'faculty', 'chair', 'formation']
    },
    positions: formationPositions,
    ref: IDProp,
    generation: {
        type: 'number',
        minimum: 1
    },
    child: {
        type: 'number',
        minimum: 1
    }
}

export const AddFormationSchema = {
    summary: 'Add a new formation',
    description: 'Add a new formation',
    tags: ['Formation route'],
    headers: HeadersSchema,
    body: {
        description: 'Request body data',
        type: 'object',
        properties: {
            data: {
                type: 'object',
                properties: formationData,
                required: ['name', 'type']
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
                    formation:{
                        type: 'object',
                        properties: {
                            id: IDProp,
                            ...formationData
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
export const AddFormationsSchema = {
    summary: 'Add a new formations',
    description: 'Add group of new formations',
    tags: ['Formation route'],
    headers: HeadersSchema,
    body: {
        description: 'Request body data',
        type: 'object',
        properties: {
            data: {
                type: 'object',
                properties: {
                    formations: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: formationData,
                            required: ['name', 'type']
                        },
                        minItems: 1
                    }
                },
                required: ['formations']
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
                    formations: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: IDProp,
                                ...formationData
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
export const AddFormationPositionsSchema = {
    summary: 'Add new positions',
    description: 'Add new positions to formation',
    tags: ['Formation route'],
    headers: HeadersSchema,
    body: {
        description: 'Request body data',
        type: 'object',
        properties: {
            data: {
                type: 'object',
                properties:{
                    id: IDProp,
                    positions: formationPositions
                },
                required: ['id', 'positions']
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
                    formation:{
                        type: 'object',
                        properties: {
                            id: IDProp,
                            ...formationData
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


export const DeleteFormationSchema = {
    summary: 'Delete',
    description: 'Delete formation',
    tags: ['Formation route'],
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
export const DeleteFormationsSchema = {
    summary: 'Multi delete',
    description: 'Delete list of formations',
    tags: ['Formation route'],
    headers: HeadersSchema,
    body: {
        description: 'Request body data',
        type: 'object',
        properties: {
            data: {
                type: 'object',
                properties:{
                    formations: {
                        type: 'array',
                        items: IDProp,
                        minItems: 1,
                        uniqueItems: true
                    }
                },
                required: ['formations']
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
export const DeleteFormationPositionsSchema = {
    summary: 'Multi delete',
    description: 'Delete list of formations',
    tags: ['Formation route'],
    headers: HeadersSchema,
    body: {
        description: 'Request body data',
        type: 'object',
        properties: {
            data: {
                type: 'object',
                properties:{
                    id: IDProp,
                    positions: {
                        type: 'array',
                        items: {
                            type: 'number',
                            minimum: 1
                        },
                        minItems: 1,
                        uniqueItems: true
                    }
                },
                required: ['id', 'positions']
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
                    formation: {
                        type: 'object',
                        properties: {
                            id: IDProp,
                            ...formationData
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


export const EditFormationSchema = {
    summary: 'Edit formation',
    description: 'Edit formation properties',
    tags: ['Formation route'],
    headers: HeadersSchema,
    body: {
        description: 'Request body data',
        type: 'object',
        properties: {
            data: {
                type: 'object',
                properties:{
                    id: IDProp,
                    ...formationData
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
                    formation: {
                        type: 'object',
                        properties: {
                            id: IDProp,
                            ...formationData
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
export const EditFormationPositionSchema = {
    summary: 'Edit position',
    description: 'Edit position from formation',
    tags: ['Formation route'],
    headers: HeadersSchema,
    body: {
        description: 'Request body data',
        type: 'object',
        properties: {
            data: {
                type: 'object',
                properties:{
                    id: IDProp,
                    position: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'number',
                                minimal: 1
                            },
                            name: nameProp
                        },
                        required: [ 'id', 'name' ]
                    }
                },
                required: ['id', 'position']
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
                    formation: {
                        type: 'object',
                        properties: {
                            id: IDProp,
                            ...formationData
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


export const GetAllFormationsSchema = {
    summary: 'Get full formations list',
    description: 'Get all formations from DB',
    tags: ['Formation route'],
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
                    formations: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: IDProp,
                                ...formationData
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
export const GetFormationsSchema = {
    summary: 'Get custom formations list',
    description: 'Get formations list from DB by ID from query param',
    tags: ['Formation route'],
    headers: HeadersSchema,
    querystring: {
        type: 'object',
        properties: {
            formations: {
                type: 'array',
                items: IDProp,
                minItems: 1,
                uniqueItems: true
            }
        },
        required: ['formations']
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
                    formations: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: IDProp,
                                ...formationData
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
export const GetFormationSchema = {
    summary: 'Get formation data',
    description: 'Get formation data from DB by ID from query param',
    tags: ['Formation route'],
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
                    formation: {
                        type: 'object',
                        properties: {
                            id: IDProp,
                            ...formationData
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