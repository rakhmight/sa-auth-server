import { JWT } from '@fastify/jwt';
import { FastifyLoggerInstance, FastifyPluginAsync, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerBase, RawServerDefault } from 'fastify'
import { FastifyRedis } from '@fastify/redis'

declare module 'fastify' {
  export interface FastifyInstance<
  RawServer extends RawServerBase = RawServerDefault,
  RawRequest extends RawRequestDefaultExpression<RawServer> = RawRequestDefaultExpression<RawServer>,
  RawReply extends RawReplyDefaultExpression<RawServer> = RawReplyDefaultExpression<RawServer>,
  Logger = FastifyLoggerInstance
> {
    jwt: JWT
    redis: FastifyRedis
    checkPermission: CheckPermissionI
  }

  interface FastifyRequest {
    // symmetricKey: string,
    user: UserDTOI
  }
}
