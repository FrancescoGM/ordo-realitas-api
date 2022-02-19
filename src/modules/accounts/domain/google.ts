import { Either, left, right } from '@core/logic/Either'

import { InvalidGoogleError } from './errors/InvalidGoogleError'

export class Google {
  private readonly google_id: string | null

  get value(): string {
    return this.google_id
  }

  private constructor(google_id: string | null) {
    this.google_id = google_id
  }

  static validate(google_id: string | null): boolean {
    if (google_id === null) {
      return true
    }

    if (
      !google_id ||
      typeof google_id !== 'string' ||
      google_id.trim().length < 2 ||
      google_id.trim().length > 255
    ) {
      return false
    }

    return true
  }

  static create(google_id: string | null): Either<InvalidGoogleError, Google> {
    if (!this.validate(google_id)) {
      return left(new InvalidGoogleError())
    }

    return right(new Google(google_id))
  }
}
