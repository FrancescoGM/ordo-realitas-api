import { Router } from 'express'

import { usersRouter } from './users.routes'

export const router = Router()

router.use('/users', usersRouter)
