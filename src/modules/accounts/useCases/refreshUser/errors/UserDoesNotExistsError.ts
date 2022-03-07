import { DomainError } from '@core/domain/errors/DomainError'

export class UserDoesNotExistsError extends Error implements DomainError {
  constructor() {
    super('User does not exists')
    this.name = 'UserDoesNotExistsError'
  }
}
