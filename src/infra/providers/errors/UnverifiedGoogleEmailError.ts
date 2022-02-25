import { DomainError } from '@core/domain/errors/DomainError'

export class UnverifiedGoogleEmailError extends Error implements DomainError {
  constructor(email: string) {
    super(`The email '${email}' is not verified by Google.`)
    this.name = 'UnverifiedGoogleEmailError'
  }
}
