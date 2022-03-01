import { Controller } from '@core/infra/Controller'
import { DayjsDateProvider } from '@infra/providers/implementations/DayjsDateProvider'
import { EmailValidator } from '@infra/validation/EmailValidator'
import { ValidatorCompositor } from '@infra/validation/ValidatorCompositor'
import { PrismaRefreshTokensRepository } from '@modules/accounts/repositories/prisma/PrismaRefreshTokensRepository'
import { PrismaUsersRepository } from '@modules/accounts/repositories/prisma/PrismaUsersRepository'
import { AuthenticateUser } from '@modules/accounts/useCases/authenticateUser/AuthenticateUser'
import { AuthenticateUserController } from '@modules/accounts/useCases/authenticateUser/AuthenticateUserController'

export function makeAuthenticateUserController(): Controller {
  const usersRepository = new PrismaUsersRepository()
  const refreshTokensRepository = new PrismaRefreshTokensRepository()
  const dateProvider = new DayjsDateProvider()
  const authenticateUser = new AuthenticateUser(
    usersRepository,
    refreshTokensRepository,
    dateProvider
  )

  const validator = new ValidatorCompositor([
    new EmailValidator('email', { required: true }),
  ])

  const authenticateUserController = new AuthenticateUserController(
    validator,
    authenticateUser
  )

  return authenticateUserController
}
