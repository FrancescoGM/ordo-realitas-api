import { prisma } from '@infra/prisma/client'
import { RefreshToken } from '@modules/accounts/domain/refresh_token'
import { RefreshTokenMapper } from '@modules/accounts/mappers/RefreshTokenMapper'

import { IRefreshTokensRepository } from '../IRefreshTokensRepository'

export class PrismaRefreshTokensRepository implements IRefreshTokensRepository {
  public async create(refreshToken: RefreshToken): Promise<void> {
    const data = RefreshTokenMapper.toPersistence(refreshToken)

    await prisma.refreshToken.create({
      data,
    })
  }

  public async findByUserId(user_id: string): Promise<RefreshToken | null> {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: {
        user_id,
      },
    })

    return refreshToken ? RefreshTokenMapper.toDomain(refreshToken) : null
  }

  public async deleteById(id: string): Promise<void> {
    await prisma.refreshToken.delete({
      where: {
        id,
      },
    })
  }
}
