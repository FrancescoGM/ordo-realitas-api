import { DomainError } from '@core/domain/errors/DomainError'

export class InvalidIdTokenError extends Error implements DomainError {
  constructor(id_token: string) {
    super(`Invalid id_token: ${id_token}`)
    this.name = 'InvalidIdTokenError'
  }
}
