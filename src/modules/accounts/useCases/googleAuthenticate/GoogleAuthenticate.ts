import { v4 as uuidV4 } from 'uuid'

import { auth } from '@config/auth'
import { Either, left, right } from '@core/logic/Either'
import { GoogleRequestError } from '@infra/providers/errors/GoogleRequestError'
import { InvalidIdTokenError } from '@infra/providers/errors/InvalidIdTokenError'
import { UnverifiedGoogleEmailError } from '@infra/providers/errors/UnverifiedGoogleEmailError'
import { IDateProvider } from '@infra/providers/models/IDateProvider'
import { IGoogleProvider } from '@infra/providers/models/IGoogleProvider'
import { InvalidTokenError } from '@modules/accounts/domain/errors/InvalidTokenError'
import { JWT } from '@modules/accounts/domain/jwt'
import { RefreshToken } from '@modules/accounts/domain/refresh_token'
import { createUser } from '@modules/accounts/domain/services/createUser'
import { Token } from '@modules/accounts/domain/token'
import { User } from '@modules/accounts/domain/user'
import { IRefreshTokensRepository } from '@modules/accounts/repositories/IRefreshTokensRepository'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'

export interface ITokenResponse {
  token: string
  refresh_token: string
  user: {
    email: string
    name: string
    avatar_url: string | null
  }
}

type IResponse = Either<
  InvalidIdTokenError | GoogleRequestError | UnverifiedGoogleEmailError,
  ITokenResponse
>

export class GoogleAuthenticate {
  constructor(
    private usersRepository: IUsersRepository,
    private googleProvider: IGoogleProvider,
    private refreshTokensRepository: IRefreshTokensRepository,
    private dateProvider: IDateProvider
  ) {}

  private async createRefreshToken(
    user: User
  ): Promise<Either<InvalidTokenError, RefreshToken>> {
    const createRefreshTokenOrError = async (): Promise<
      Either<InvalidTokenError, RefreshToken>
    > => {
      const expires_at = this.dateProvider.addDays(
        this.dateProvider.dateNow(),
        auth.refreshTokenExpiresIn
      )

      const token = Token.create(uuidV4())

      if (token.isLeft()) {
        return left(token.value)
      }

      const refreshTokenOrError = RefreshToken.create({
        user_id: user.id,
        token: token.value,
        expires_at,
      })

      if (refreshTokenOrError.isLeft()) {
        return left(refreshTokenOrError.value)
      }

      refresh_token = refreshTokenOrError.value

      await this.refreshTokensRepository.create(refresh_token)

      return right(refresh_token)
    }

    const refreshTokenExists = await this.refreshTokensRepository.findByUserId(
      user.id
    )

    let refresh_token: RefreshToken

    if (!refreshTokenExists) {
      return await createRefreshTokenOrError()
    }

    await this.refreshTokensRepository.deleteById(refreshTokenExists.id)

    return await createRefreshTokenOrError()
  }

  async execute(id_token: string): Promise<IResponse> {
    const googleUser = await this.googleProvider.getUser(id_token)

    if (googleUser.isLeft()) {
      return left(googleUser.value)
    }

    const userExists = await this.usersRepository.findByEmail(
      googleUser.value.email
    )

    if (!userExists) {
      const userOrError = createUser({
        email: googleUser.value.email,
        name: googleUser.value.name,
        avatar_url: googleUser.value.picture,
        google_id: googleUser.value.sub,
        password: null,
      })

      if (userOrError.isLeft()) {
        return left(userOrError.value)
      }

      await this.usersRepository.create(userOrError.value)

      const token = JWT.signUser(userOrError.value)

      const refreshTokenOrError = await this.createRefreshToken(
        userOrError.value
      )

      if (refreshTokenOrError.isLeft()) {
        return left(refreshTokenOrError.value)
      }

      return right({
        token: token.token,
        refresh_token: refreshTokenOrError.value.token.value,
        user: {
          email: userOrError.value.email.value,
          name: userOrError.value.name.value,
          avatar_url: userOrError.value.avatar_url.value,
        },
      })
    }

    const refreshTokenOrError = await this.createRefreshToken(userExists)

    if (refreshTokenOrError.isLeft()) {
      return left(refreshTokenOrError.value)
    }

    const token = JWT.signUser(userExists)

    return right({
      token: token.token,
      refresh_token: refreshTokenOrError.value.token.value,
      user: {
        email: userExists.email.value,
        name: userExists.name.value,
        avatar_url: userExists.avatar_url.value,
      },
    })
  }
}
