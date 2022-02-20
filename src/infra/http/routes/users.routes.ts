import { Router } from 'express'

import { adaptRoute } from '../adapters/RouteAdapter'
import { makeRegisterUserController } from '../factories/controllers/makeRegisterUserController'

export const usersRouter = Router()

usersRouter.post('/', adaptRoute(makeRegisterUserController()))
