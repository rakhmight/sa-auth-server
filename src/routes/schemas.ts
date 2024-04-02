// General
export const BadRequestError = {
  description: "Bad request (request parameters not taken into account)",
  type: "object",
  properties: {
    statusCode: {
      type: "integer",
      default: 400,
    },
    message: {
      type: "string",
      default: "Bad request",
    },
  },
};

export const AccessDeniedError = {
  description: "Access dined",
  type: "object",
  properties: {
    statusCode: {
      type: "integer",
      default: 403
    },
    message: {
      type: "string",
      default: "Forbidden"
    },
  },
};

export const InternalServerError = {
  description: "Some server internal problems",
  type: "object",
  properties: {
    statusCode: {
      type: "integer",
      default: 500
    },
    message: {
      type: "string",
      default: "Internal problems"
    },
  },
};

export const NotFoundError = {
  description: "Resource not found",
  type: "object",
  properties: {
    statusCode: {
      type: "integer",
      default: 404
    },
    message: {
      type: "string",
      default: "Not found"
    },
  },
}

// Header
export const HeadersSchema = {
  type: "object",
  properties: {
    Authorization: {
      type: "string",
      description: "Access token (Bearer ...)"
    },
  },
  required: ["Authorization"],
};

export const WithoutAuthHeaderSchema = {
  type: 'object',
  properties: {
      //DeviceID: { type: 'string', description: 'Device (client) id issued by the server'}
  },
  //required: ['DeviceID'] 
}

// Cookies
export const RefreshTokenCookieSchema = {
  description: 'Request cookies',
  type: 'object',
  properties: {
      description: 'Refresh token',
      refreshToken: {
          type: 'string'
      }   
  },
  required: ['refreshToken']
}

// User
export const AlreadyExistError = {
  description: "User already exist (by login)",
  type: "object",
  properties: {
    statusCode: {
      type: "integer",
      default: 409
    },
    message: {
      type: "string",
      default: "User already exist"
    },
  },
};

export const UserNotFoundError = {
  description: "User not found",
  type: "object",
  properties: {
    statusCode: {
      type: "integer",
      default: 404
    },
    message: {
      type: "string",
      default: "User not found"
    },
  },
}

export const UnauthorizedError = {
  description: "User not authorized",
  type: "object",
  properties: {
    statusCode: {
      type: "integer",
      default: 401
    },
    message: {
      type: "string",
      default: "Unauthorized"
    },
  },
};

export const nameProp = {
  type: 'array',
  items: {
      type: 'object',
      properties: {
          ISOCode: {
              type: 'string',
              enum: ['RU', 'EN', 'UZ', 'FR', 'DE', 'JP', 'CN', 'KR', 'IT', 'BY', 'IN', 'UA', 'TJ', 'TR', 'TM', 'KZ', 'AF', 'AZ', 'IR', 'IQ']
          },
          value: {
              type: 'string',
              minLength: 7
          }
      },
      required: ['ISOCode', 'value']
  },
  minItems: 1
}

export const IDProp = {
  type: 'string',
  format: 'uuid',
  pattern: '^[0-9a-fA-F]{24}$'
}