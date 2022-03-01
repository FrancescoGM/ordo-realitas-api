import { Controller } from '@core/infra/Controller'
import { DayjsDateProvider } from '@infra/providers/implementations/DayjsDateProvider'
import { GoogleProvider } from '@infra/providers/implementations/GoogleProvider'
import { PrismaRefreshTokensRepository } from '@modules/accounts/repositories/prisma/PrismaRefreshTokensRepository'
import { PrismaUsersRepository } from '@modules/accounts/repositories/prisma/PrismaUsersRepository'
import { GoogleAuthenticate } from '@modules/accounts/useCases/googleAuthenticate/GoogleAuthenticate'
import { GoogleAuthenticateController } from '@modules/accounts/useCases/googleAuthenticate/GoogleAuthenticateController'

export function makeGoogleAuthenticateController(): Controller {
  const usersRepository = new PrismaUsersRepository()
  const googleProvider = new GoogleProvider()
  const refreshTokensRepository = new PrismaRefreshTokensRepository()
  const dateProvider = new DayjsDateProvider()

  const googleAuthenticate = new GoogleAuthenticate(
    usersRepository,
    googleProvider,
    refreshTokensRepository,
    dateProvider
  )

  const googleAuthenticateController = new GoogleAuthenticateController(
    googleAuthenticate
  )

  return googleAuthenticateController
}
