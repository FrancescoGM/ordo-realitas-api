import { Router } from 'express'

import { adaptMiddleware } from '../adapters/MiddlewareAdapter'
import { adaptRoute } from '../adapters/RouteAdapter'
import { makeAuthenticateUserController } from '../factories/controllers/AuthenticateUserControllerFactory'
import { makeGoogleAuthenticateController } from '../factories/controllers/GoogleAuthenticateControllerFactory'
import { makeRefreshSessionToken } from '../factories/controllers/RefreshSessionTokenControllerFactory'
import { makeRefreshUserController } from '../factories/controllers/RefreshUserControllerFactory'
import { makeAuthenticatedMiddleware } from '../factories/middlewares/EnsureAuthenticatedMiddlewareFactory'

export const sessionsRouter = Router()

sessionsRouter.post('/google', adaptRoute(makeGoogleAuthenticateController()))
sessionsRouter.post('/', adaptRoute(makeAuthenticateUserController()))
sessionsRouter.post('/refresh', adaptRoute(makeRefreshSessionToken()))
sessionsRouter.get(
  '/refresh/user',
  adaptMiddleware(makeAuthenticatedMiddleware()),
  adaptRoute(makeRefreshUserController())
)
