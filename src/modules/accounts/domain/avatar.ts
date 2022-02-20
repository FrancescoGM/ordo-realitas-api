import { Either, left, right } from '@core/logic/Either'

import { InvalidAvatarError } from './errors/InvalidAvatarError'
import { InvalidAvatarFileError } from './errors/InvalidAvatarFileError'

export class Avatar {
  private readonly avatar_url: string | null

  get value(): string | null {
    return this.avatar_url
  }

  private constructor(avatarUrl: string | null) {
    this.avatar_url = avatarUrl
  }

  static validate(avatarUrl: string | null): boolean {
    if (avatarUrl === null) {
      return true
    }

    if (
      !avatarUrl ||
      typeof avatarUrl !== 'string' ||
      avatarUrl.trim().length < 2 ||
      avatarUrl.trim().length > 255
    ) {
      return false
    }

    const regex = /\.(jpe?g|png|gif)$/i

    if (!regex.test(avatarUrl)) {
      return false
    }

    return true
  }

  static create(
    avatarUrl: string | null
  ): Either<InvalidAvatarError | InvalidAvatarFileError, Avatar> {
    if (!this.validate(avatarUrl)) {
      return left(new InvalidAvatarError())
    }

    return right(new Avatar(avatarUrl))
  }
}
