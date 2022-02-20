import { Controller } from '@core/infra/Controller'
import { CompareFieldsValidator } from '@infra/validation/CompareFieldsValidator'
import { ValidatorCompositor } from '@infra/validation/ValidatorCompositor'
import { PrismaUsersRepository } from '@modules/accounts/repositories/prisma/PrismaUsersRepository'
import { RegisterUser } from '@modules/accounts/useCases/registerUser/RegisterUser'
import { RegisterUserController } from '@modules/accounts/useCases/registerUser/RegisterUserController'

export function makeRegisterUserController(): Controller {
  const prismaUsersRepository = new PrismaUsersRepository()
  const registerUser = new RegisterUser(prismaUsersRepository)

  const validator = new ValidatorCompositor([
    new CompareFieldsValidator('password', 'password_confirmation'),
  ])

  const registerUserController = new RegisterUserController(
    validator,
    registerUser
  )

  return registerUserController
}
