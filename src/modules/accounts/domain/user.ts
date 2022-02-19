import { Entity } from '@core/domain/Entity'
import { Either, right } from '@core/logic/Either'

import { Avatar } from './avatar'
import { Email } from './email'
import { InvalidAvatarError } from './errors/InvalidAvatarError'
import { InvalidAvatarFileError } from './errors/InvalidAvatarFileError'
import { InvalidEmailError } from './errors/InvalidEmailError'
import { InvalidGoogleError } from './errors/InvalidGoogleError'
import { InvalidNameError } from './errors/InvalidNameError'
import { InvalidPasswordLengthError } from './errors/InvalidPasswordError'
import { Google } from './google'
import { Name } from './name'
import { Password } from './password'

interface IUserProps {
  name: Name
  email: Email
  password: Password
  avatar_url: Avatar
  google_id: Google
}

export class User extends Entity<IUserProps> {
  get name(): Name {
    return this.props.name
  }

  get email(): Email {
    return this.props.email
  }

  get password(): Password {
    return this.props.password
  }

  get avatar_url(): Avatar {
    return this.props.avatar_url
  }

  get google_id(): Google {
    return this.props.google_id
  }

  private constructor(props: IUserProps, id?: string) {
    super(props, id)
  }

  static create(
    props: IUserProps,
    id?: string
  ): Either<
    | InvalidAvatarError
    | InvalidAvatarFileError
    | InvalidEmailError
    | InvalidNameError
    | InvalidPasswordLengthError
    | InvalidGoogleError,
    User
  > {
    const user = new User(props, id)

    return right(user)
  }
}
