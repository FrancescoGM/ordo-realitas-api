import { Either, left, right } from '@core/logic/Either'
import { InvalidTokenError } from '@modules/accounts/domain/errors/InvalidTokenError'
import { JWT } from '@modules/accounts/domain/jwt'
import { Token } from '@modules/accounts/domain/token'
import { IRefreshTokensRepository } from '@modules/accounts/repositories/IRefreshTokensRepository'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'

import { AccountDoesNotExists } from './errors/AccountDoesNotExists'
import { RefreshTokenDoesNotExistError } from './errors/RefreshTokenDoesNotExistError'
import { SessionExpiredError } from './errors/SessionExpiredError'

interface IResponse {
  token: string
}

interface IRequest {
  refresh_token: string
}

export class RefreshSessionToken {
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly refreshTokensRepository: IRefreshTokensRepository
  ) {}

  async execute({
    refresh_token,
  }: IRequest): Promise<
    Either<
      | InvalidTokenError
      | RefreshTokenDoesNotExistError
      | SessionExpiredError
      | AccountDoesNotExists,
      IResponse
    >
  > {
    const tokenOrError = Token.create(refresh_token)

    if (tokenOrError.isLeft()) {
      return left(tokenOrError.value)
    }

    const refreshToken = tokenOrError.value

    const refreshTokenExists = await this.refreshTokensRepository.findByToken(
      refreshToken.value
    )

    if (!refreshTokenExists) {
      return left(new RefreshTokenDoesNotExistError())
    }

    if (refreshTokenExists.isExpired()) {
      return left(new SessionExpiredError())
    }

    const user = await this.usersRepository.findById(refreshTokenExists.user_id)

    if (!user) {
      return left(new AccountDoesNotExists())
    }

    const jwt = JWT.signUser(user)

    return right({
      token: jwt.token,
    })
  }
}
