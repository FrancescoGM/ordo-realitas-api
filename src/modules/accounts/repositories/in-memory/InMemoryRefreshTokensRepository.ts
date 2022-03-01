import { RefreshToken } from '@modules/accounts/domain/refresh_token'

import { IRefreshTokensRepository } from '../IRefreshTokensRepository'

export class InMemoryRefreshTokensRepository
  implements IRefreshTokensRepository
{
  private refreshTokens: RefreshToken[] = []

  async findByUserId(userId: string): Promise<RefreshToken | null> {
    const refreshToken = this.refreshTokens.find(
      (refreshToken) => refreshToken.user_id === userId
    )
    return refreshToken || null
  }

  async create(refreshToken: RefreshToken): Promise<void> {
    this.refreshTokens.push(refreshToken)
  }

  async deleteById(id: string): Promise<void> {
    this.refreshTokens = this.refreshTokens.filter(
      (refreshToken) => refreshToken.id !== id
    )
  }
}
