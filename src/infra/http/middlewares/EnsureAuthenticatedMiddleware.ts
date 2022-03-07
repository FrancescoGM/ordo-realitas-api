import { verify } from 'jsonwebtoken'

import { auth } from '@config/auth'
import { forbidden, HttpResponse, ok, fail } from '@core/infra/HttpResponse'
import { Middleware } from '@core/infra/Middleware'

import { AccessDeniedError } from '../errors/AccessDeniedError'

interface IRequest {
  accessToken: string
}

interface IPayloadJwt {
  sub: string
}

export class EnsureAuthenticatedMiddleware implements Middleware {
  constructor() {}

  async handle(request: IRequest): Promise<HttpResponse> {
    try {
      const { accessToken } = request

      if (accessToken) {
        try {
          const token = accessToken.replace(/^Bearer\s/, '')
          const payload = verify(token, auth.secretKey) as IPayloadJwt

          return ok({ userId: payload.sub })
        } catch (err) {
          return forbidden(new AccessDeniedError())
        }
      } else {
        return forbidden(new AccessDeniedError())
      }
    } catch (error) {
      return fail(error)
    }
  }
}

export namespace AuthMiddleware {
  export type Request = {
    accessToken?: string
  }
}
