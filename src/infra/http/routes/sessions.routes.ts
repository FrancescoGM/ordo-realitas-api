import { Router } from 'express'

import { adaptRoute } from '../adapters/RouteAdapter'
import { makeAuthenticateUserController } from '../factories/controllers/AuthenticateUserController'

export const sessionsRouter = Router()

sessionsRouter.post('/google', adaptRoute(makeAuthenticateUserController()))
