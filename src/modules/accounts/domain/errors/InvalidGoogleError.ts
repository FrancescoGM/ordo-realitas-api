import { DomainError } from '@core/domain/errors/DomainError'

export class InvalidGoogleError extends Error implements DomainError {
  constructor() {
    super(`The google id is invalid.`)
    this.name = 'InvalidGoogleError'
  }
}
