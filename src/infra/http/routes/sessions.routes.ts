import { Router } from 'express'

import { adaptRoute } from '../adapters/RouteAdapter'
import { makeAuthenticateUserController } from '../factories/controllers/AuthenticateUserControllerFactory'
import { makeGoogleAuthenticateController } from '../factories/controllers/GoogleAuthenticateControllerFactory'

export const sessionsRouter = Router()

sessionsRouter.post('/google', adaptRoute(makeGoogleAuthenticateController()))
sessionsRouter.post('/', adaptRoute(makeAuthenticateUserController()))
