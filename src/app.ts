// modules
import fastify from 'fastify'
import 'dotenv/config'

// routes
import UserRoute from './routes/user-route/UserRoute'
import FormationRoute from './routes/formation-route/FormationRoute'
import SpecialtyRoute from './routes/specialty-route/SpecialtyRoute'
import SystemRoute from './routes/system-route/SystemRoute'
import PingRoute from './routes/ping-route/PingRoute'

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
import { FastifyInstance } from 'fastify/types/instance'
// import { checkPermissionPlugin } from './middlewares/checkPermissionMiddleware'

// middleware

export const build = (opts = {}) => {
    const app = fastify(opts)
    checkServerEnv(app)
  
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
    app.register(FormationRoute)
    app.register(SpecialtyRoute)
    app.register(SystemRoute)
    app.register(PingRoute)
  
    app.after()
    return app;
  }

  function checkServerEnv(app:FastifyInstance){
    if(!process.env.SERVER_PORT){
      app.log.fatal('The environment variable responsible for the server port is not set')
      process.exit(1)
    }
    
    if(!process.env.COOKIE_SECRET){
      app.log.fatal('The environment variable responsible for the cookie secret password is not set')
      process.exit(1)
    }
    
    if(!process.env.MONGO_DB_ADDRESS || !process.env.MONGO_DB_PORT || !process.env.MONGO_DB_USER || !process.env.MONGO_DB_PASSWORD || !process.env.MONGO_DB_NAME){
      app.log.fatal('The environment variable responsible for connecting to the MongoDB database is not set')
      process.exit(1)
    }
    
    if(!process.env.REDIS_ADDRESS || !process.env.REDIS_PORT || !process.env.REDIS_USER || !process.env.REDIS_PASSWORD || !process.env.REDIS_JWT_DB_INDEX || !process.env.REDIS_E2E_DB_INDEX){
      app.log.fatal('The environment variable responsible for connecting to the Redis database is not set')
      process.exit(1)
    }

    if(!process.env.HMAC_SECRET){
      app.log.fatal('The environment variable responsible for hmac secret password is not set')
      process.exit(1)
    }

    if(!process.env.JWT_PUBLIC || !process.env.JWT_PRIVATE){
      app.log.fatal('The environment variable responsible for JWT is not set')
      process.exit(1)
    }

    if(!process.env.SERVER_SIGNING_PUBLIC || !process.env.SERVER_SIGNING_PRIVATE){
      app.log.fatal('The environment variable responsible for server signing is not set')
      process.exit(1)
    }
  }