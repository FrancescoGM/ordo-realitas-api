import { DomainError } from '@core/domain/errors/DomainError'

export class AccountAlreadyExistsError extends Error implements DomainError {
  constructor(public email: string) {
    super(`Account with email '${email}' already exists`)
    this.name = 'AccountAlreadyExistsError'
  }
}
