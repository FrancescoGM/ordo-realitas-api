import { RefreshToken as PrismaRefreshToken } from '@prisma/client'

import { RefreshToken } from '../domain/refresh_token'
import { Token } from '../domain/token'

export class RefreshTokenMapper {
  static toPersistence(refreshToken: RefreshToken) {
    return {
      id: refreshToken.id,
      user_id: refreshToken.user_id,
      token: refreshToken.token.value,
      expires_at: refreshToken.expires_at,
    }
  }

  static toDomain(refreshToken: PrismaRefreshToken): RefreshToken {
    const token = Token.create(refreshToken.token)

    if (token.isLeft()) {
      throw new Error('Token not created')
    }

    const refreshTokenOrError = RefreshToken.create(
      {
        user_id: refreshToken.user_id,
        token: token.value,
        expires_at: refreshToken.expires_at,
      },
      refreshToken.id
    )

    if (refreshTokenOrError.isLeft()) {
      throw new Error('RefreshToken not created')
    }

    return refreshTokenOrError.value
  }
}
