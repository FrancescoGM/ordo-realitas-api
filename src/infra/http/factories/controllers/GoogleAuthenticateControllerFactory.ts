import { Controller } from '@core/infra/Controller'
import { GoogleProvider } from '@infra/providers/implementations/GoogleProvider'
import { PrismaUsersRepository } from '@modules/accounts/repositories/prisma/PrismaUsersRepository'
import { GoogleAuthenticate } from '@modules/accounts/useCases/googleAuthenticate/GoogleAuthenticate'
import { GoogleAuthenticateController } from '@modules/accounts/useCases/googleAuthenticate/GoogleAuthenticateController'

export function makeGoogleAuthenticateController(): Controller {
  const usersRepository = new PrismaUsersRepository()
  const googleProvider = new GoogleProvider()
  const googleAuthenticate = new GoogleAuthenticate(
    usersRepository,
    googleProvider
  )

  const googleAuthenticateController = new GoogleAuthenticateController(
    googleAuthenticate
  )

  return googleAuthenticateController
}
