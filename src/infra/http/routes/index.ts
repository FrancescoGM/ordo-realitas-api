import { Router } from 'express'

import { sessionsRouter } from './sessions.routes'
import { usersRouter } from './users.routes'

export const router = Router()

router.use('/users', usersRouter)
router.use('/sessions', sessionsRouter)
