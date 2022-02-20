import { Either, left, right } from '@core/logic/Either'
import { AccountAlreadyExistsError } from '@modules/accounts/useCases/registerUser/errors/AccountAlreadyExistsError'

import { Avatar } from '../avatar'
import { Email } from '../email'
import { InvalidAvatarError } from '../errors/InvalidAvatarError'
import { InvalidAvatarFileError } from '../errors/InvalidAvatarFileError'
import { InvalidEmailError } from '../errors/InvalidEmailError'
import { InvalidGoogleError } from '../errors/InvalidGoogleError'
import { InvalidNameError } from '../errors/InvalidNameError'
import { InvalidPasswordLengthError } from '../errors/InvalidPasswordError'
import { Google } from '../google'
import { Name } from '../name'
import { Password } from '../password'
import { User } from '../user'

interface ICreateUserRequest {
  name: string
  email: string
  password: string | null
  avatar_url?: string | null
  google_id?: string | null
}

type ICreateUserResponse = Either<
  | InvalidAvatarError
  | InvalidAvatarFileError
  | InvalidEmailError
  | InvalidNameError
  | InvalidPasswordLengthError
  | AccountAlreadyExistsError
  | InvalidGoogleError,
  User
>

export function createUser({
  name,
  email,
  password,
  avatar_url = null,
  google_id = null,
}: ICreateUserRequest): ICreateUserResponse {
  const nameOrError = Name.create(name)
  const emailOrError = Email.create(email)
  const passwordOrError = Password.create(password)
  const avatarOrError = Avatar.create(avatar_url)
  const googleIdOrError = Google.create(google_id)

  if (nameOrError.isLeft()) return left(nameOrError.value)
  if (emailOrError.isLeft()) return left(emailOrError.value)
  if (passwordOrError.isLeft()) return left(passwordOrError.value)
  if (avatarOrError.isLeft()) return left(avatarOrError.value)
  if (googleIdOrError.isLeft()) return left(googleIdOrError.value)

  const userOrError = User.create({
    name: nameOrError.value,
    email: emailOrError.value,
    password: passwordOrError.value,
    avatar_url: avatarOrError.value,
    google_id: googleIdOrError.value,
  })

  if (userOrError.isLeft()) return left(userOrError.value)

  return right(userOrError.value)
}
