// modules
import fastify from 'fastify'
import 'dotenv/config'

// routes
import UserRoute from './routes/user-route/UserRoute'

// plugins
import { dbPlugin, dbParams } from './plugins/mongodb'
import { corsParams } from './plugins/cors'
import { cookieParams } from './plugins/cookie'
import { jwtParams } from './plugins/jwt'
import { swaggerParams } from './plugins/swagger'
import { swaggerUIParams } from './plugins/swagger/ui'
// import { JWTRedisParams, E2ERedisParams, redisPlugin } from './plugins/redis'

// types
import type { FastifyCookieOptions } from '@fastify/cookie'
import { checkPermissionPlugin } from './middlewares/checkPermissionMiddleware'

// middleware

export const build = (opts = {}) => {
    const app = fastify(opts)
  
    app.register(require('@fastify/cors'), corsParams)
    app.register(require('@fastify/cookie'), cookieParams as FastifyCookieOptions)
    app.register(require('@fastify/jwt'), jwtParams)
    app.register(dbPlugin, dbParams)
    app.register(require('@fastify/swagger'), swaggerParams)
    app.register(require('@fastify/swagger-ui'), swaggerUIParams)

    // app.register(redisPlugin, JWTRedisParams)
    // app.register(require('@fastify/redis'), JWTRedisParams)
    // app.register(require('@fastify/redis'), E2ERedisParams)
    
    // app.addHook('preValidation', secureLayerMiddleware)
    // app.addHook('onSend', responseMiddleware)

    // app.register(checkPermissionPlugin)
    
    app.register(UserRoute)
  
    app.after()
    return app;
  }