import { RefreshToken } from '../domain/refresh_token'

export interface IRefreshTokensRepository {
  findByUserId(userId: string): Promise<RefreshToken | null>
  create(refreshToken: RefreshToken): Promise<void>
  deleteById(id: string): Promise<void>
}
