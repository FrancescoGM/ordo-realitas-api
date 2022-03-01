import { DomainError } from '@core/domain/errors/DomainError'

export class InvalidTokenError extends Error implements DomainError {
  constructor(token: string) {
    super(`The token '${token}' is invalid or malformed`)
    this.name = 'InvalidTokenError'
  }
}
