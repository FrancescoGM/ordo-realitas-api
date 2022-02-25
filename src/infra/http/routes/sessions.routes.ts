import { Router } from 'express'

import { adaptRoute } from '../adapters/RouteAdapter'
import { makeGoogleAuthenticateController } from '../factories/controllers/GoogleAuthenticateControllerFactory'

export const sessionsRouter = Router()

sessionsRouter.post('/google', adaptRoute(makeGoogleAuthenticateController()))
