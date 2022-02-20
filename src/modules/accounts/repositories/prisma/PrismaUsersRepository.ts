import { prisma } from '@infra/prisma/client'
import { User } from '@modules/accounts/domain/user'
import { UserMapper } from '@modules/accounts/mappers/UserMapper'

import { IUsersRepository } from '../IUsersRepository'

export class PrismaUsersRepository implements IUsersRepository {
  async exists(email: string): Promise<boolean> {
    const userExists = await prisma.user.findUnique({
      where: { email },
    })

    return !!userExists
  }
  async create(user: User): Promise<void> {
    const data = await UserMapper.toPersistence(user)

    await prisma.user.create({
      data,
    })
  }
}
