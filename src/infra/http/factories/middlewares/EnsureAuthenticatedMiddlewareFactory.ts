import { Middleware } from '@core/infra/Middleware'
import { EnsureAuthenticatedMiddleware } from '@infra/http/middlewares/EnsureAuthenticatedMiddleware'

export function makeAuthenticatedMiddleware(): Middleware {
  const ensureAuthenticatedMiddleware = new EnsureAuthenticatedMiddleware()

  return ensureAuthenticatedMiddleware
}
