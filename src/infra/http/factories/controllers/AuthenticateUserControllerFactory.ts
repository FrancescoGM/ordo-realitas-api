import { Controller } from '@core/infra/Controller'
import { EmailValidator } from '@infra/validation/EmailValidator'
import { ValidatorCompositor } from '@infra/validation/ValidatorCompositor'
import { PrismaUsersRepository } from '@modules/accounts/repositories/prisma/PrismaUsersRepository'
import { AuthenticateUser } from '@modules/accounts/useCases/authenticateUser/AuthenticateUser'
import { AuthenticateUserController } from '@modules/accounts/useCases/authenticateUser/AuthenticateUserController'

export function makeAuthenticateUserController(): Controller {
  const usersRepository = new PrismaUsersRepository()
  const authenticateUser = new AuthenticateUser(usersRepository)

  const validator = new ValidatorCompositor([
    new EmailValidator('email', { required: true }),
  ])

  const authenticateUserController = new AuthenticateUserController(
    validator,
    authenticateUser
  )

  return authenticateUserController
}
