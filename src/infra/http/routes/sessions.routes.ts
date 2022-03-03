import { Router } from 'express'

import { adaptRoute } from '../adapters/RouteAdapter'
import { makeAuthenticateUserController } from '../factories/controllers/AuthenticateUserControllerFactory'
import { makeGoogleAuthenticateController } from '../factories/controllers/GoogleAuthenticateControllerFactory'
import { makeRefreshSessionToken } from '../factories/controllers/RefreshSessionTokenControllerFactory'

export const sessionsRouter = Router()

sessionsRouter.post('/google', adaptRoute(makeGoogleAuthenticateController()))
sessionsRouter.post('/', adaptRoute(makeAuthenticateUserController()))
sessionsRouter.post('/refresh', adaptRoute(makeRefreshSessionToken()))
