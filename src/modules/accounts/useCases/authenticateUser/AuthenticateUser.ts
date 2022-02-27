import { Either, left, right } from '@core/logic/Either'
import { JWT } from '@modules/accounts/domain/jwt'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'

import { IncorrectAccountError } from './errors/IncorrectAccountError'

interface IRequest {
  email: string
  password: string
}

export interface ITokenResponse {
  token: string
  user: {
    name: string
    email: string
    avatar_url: string
  }
}

type IResponse = Either<IncorrectAccountError, ITokenResponse>

export class AuthenticateUser {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const userExists = await this.usersRepository.findByEmail(email)

    if (!userExists) {
      return left(new IncorrectAccountError())
    }

    const isPasswordValid = await userExists.password.comparePassword(password)

    if (!isPasswordValid) {
      return left(new IncorrectAccountError())
    }

    const token = JWT.signUser(userExists)

    return right({
      token: token.token,
      user: {
        name: userExists.name.value,
        email: userExists.email.value,
        avatar_url: userExists.avatar_url.value,
      },
    })
  }
}
