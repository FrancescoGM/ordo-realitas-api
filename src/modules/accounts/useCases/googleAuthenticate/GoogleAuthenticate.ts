import { Either, left, right } from '@core/logic/Either'
import { GoogleRequestError } from '@infra/providers/errors/GoogleRequestError'
import { InvalidIdTokenError } from '@infra/providers/errors/InvalidIdTokenError'
import { UnverifiedGoogleEmailError } from '@infra/providers/errors/UnverifiedGoogleEmailError'
import { IGoogleProvider } from '@infra/providers/models/IGoogleProvider'
import { JWT } from '@modules/accounts/domain/jwt'
import { createUser } from '@modules/accounts/domain/services/createUser'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'

export interface ITokenResponse {
  token: string
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
    private googleProvider: IGoogleProvider
  ) {}

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

      return right({
        token: token.token,
        user: {
          email: userOrError.value.email.value,
          name: userOrError.value.name.value,
          avatar_url: userOrError.value.avatar_url.value,
        },
      })
    }

    const token = JWT.signUser(userExists)

    return right({
      token: token.token,
      user: {
        email: userExists.email.value,
        name: userExists.name.value,
        avatar_url: userExists.avatar_url.value,
      },
    })
  }
}
