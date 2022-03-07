import { Controller } from '@core/infra/Controller'
import { PrismaUsersRepository } from '@modules/accounts/repositories/prisma/PrismaUsersRepository'
import { RefreshUser } from '@modules/accounts/useCases/refreshUser/RefreshUser'
import { RefreshUserController } from '@modules/accounts/useCases/refreshUser/RefreshUserController'

export function makeRefreshUserController(): Controller {
  const usersRepository = new PrismaUsersRepository()
  const refreshUser = new RefreshUser(usersRepository)
  const refreshUserController = new RefreshUserController(refreshUser)

  return refreshUserController
}
