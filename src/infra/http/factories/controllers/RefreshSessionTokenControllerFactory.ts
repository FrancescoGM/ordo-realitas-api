import { Controller } from '@core/infra/Controller'
import { PrismaRefreshTokensRepository } from '@modules/accounts/repositories/prisma/PrismaRefreshTokensRepository'
import { PrismaUsersRepository } from '@modules/accounts/repositories/prisma/PrismaUsersRepository'
import { RefreshSessionToken } from '@modules/accounts/useCases/refreshSessionToken/RefreshSessionToken'
import { RefreshSessionTokenController } from '@modules/accounts/useCases/refreshSessionToken/RefreshSessionTokenController'

export function makeRefreshSessionToken(): Controller {
  const usersRepository = new PrismaUsersRepository()
  const refreshTokensRepository = new PrismaRefreshTokensRepository()

  const refreshSessionToken = new RefreshSessionToken(
    usersRepository,
    refreshTokensRepository
  )

  const refreshSessionTokenController = new RefreshSessionTokenController(
    refreshSessionToken
  )

  return refreshSessionTokenController
}
