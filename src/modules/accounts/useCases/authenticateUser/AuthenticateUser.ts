import { v4 as uuidV4 } from 'uuid'

import { auth } from '@config/auth'
import { Either, left, right } from '@core/logic/Either'
import { IDateProvider } from '@infra/providers/models/IDateProvider'
import { InvalidTokenError } from '@modules/accounts/domain/errors/InvalidTokenError'
import { JWT } from '@modules/accounts/domain/jwt'
import { RefreshToken } from '@modules/accounts/domain/refresh_token'
import { Token } from '@modules/accounts/domain/token'
import { User } from '@modules/accounts/domain/user'
import { IRefreshTokensRepository } from '@modules/accounts/repositories/IRefreshTokensRepository'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'

import { IncorrectAccountError } from './errors/IncorrectAccountError'

interface IRequest {
  email: string
  password: string
}

export interface ITokenResponse {
  token: string
  refresh_token: string
  user: {
    name: string
    email: string
    avatar_url: string
  }
}

type IResponse = Either<IncorrectAccountError, ITokenResponse>

export class AuthenticateUser {
  constructor(
    private usersRepository: IUsersRepository,
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

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const userExists = await this.usersRepository.findByEmail(email)

    if (!userExists) {
      return left(new IncorrectAccountError())
    }

    const isPasswordValid = await userExists.password.comparePassword(password)

    if (!isPasswordValid) {
      return left(new IncorrectAccountError())
    }

    const refresh_token = await this.createRefreshToken(userExists)

    if (refresh_token.isLeft()) {
      return left(refresh_token.value)
    }

    const token = JWT.signUser(userExists)

    return right({
      token: token.token,
      refresh_token: refresh_token.value.token.value,
      user: {
        name: userExists.name.value,
        email: userExists.email.value,
        avatar_url: userExists.avatar_url.value,
      },
    })
  }
}
