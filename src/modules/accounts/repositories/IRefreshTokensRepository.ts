import { RefreshToken } from '../domain/refresh_token'

export interface IRefreshTokensRepository {
  findByToken(token: string): Promise<RefreshToken | null>
  findByUserId(userId: string): Promise<RefreshToken | null>
  create(refreshToken: RefreshToken): Promise<void>
  deleteById(id: string): Promise<void>
}
