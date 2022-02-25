import { Router } from 'express'

import { adaptRoute } from '../adapters/RouteAdapter'
import { makeRegisterUserController } from '../factories/controllers/RegisterUserControllerFactory'

export const usersRouter = Router()

usersRouter.post('/', adaptRoute(makeRegisterUserController()))
