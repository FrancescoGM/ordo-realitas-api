import { Either, left, right } from '@core/logic/Either'
import { InvalidAvatarError } from '@modules/accounts/domain/errors/InvalidAvatarError'
import { InvalidAvatarFileError } from '@modules/accounts/domain/errors/InvalidAvatarFileError'
import { InvalidEmailError } from '@modules/accounts/domain/errors/InvalidEmailError'
import { InvalidGoogleError } from '@modules/accounts/domain/errors/InvalidGoogleError'
import { InvalidNameError } from '@modules/accounts/domain/errors/InvalidNameError'
import { InvalidPasswordLengthError } from '@modules/accounts/domain/errors/InvalidPasswordError'
import { createUser } from '@modules/accounts/domain/services/createUser'
import { User } from '@modules/accounts/domain/user'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'

import { AccountAlreadyExistsError } from './errors/AccountAlreadyExistsError'

interface IRequest {
  name: string
  email: string
  password: string | null
  avatar_url?: string | null
  google_id?: string | null
}

type IResponse = Either<
  | InvalidAvatarError
  | InvalidAvatarFileError
  | InvalidEmailError
  | InvalidNameError
  | InvalidPasswordLengthError
  | AccountAlreadyExistsError
  | InvalidGoogleError,
  User
>

export class RegisterUser {
  constructor(private usersRepository: IUsersRepository) {}

  async execute({
    name,
    email,
    password,
    avatar_url,
    google_id,
  }: IRequest): Promise<IResponse> {
    const userOrError = createUser({
      name,
      email,
      password,
      avatar_url,
      google_id,
    })

    if (userOrError.isLeft()) return left(userOrError.value)

    const user = userOrError.value

    const userAlreadyExists = await this.usersRepository.exists(email)

    if (userAlreadyExists) {
      return left(new AccountAlreadyExistsError(user.email.value))
    }

    await this.usersRepository.create(user)

    return right(user)
  }
}
