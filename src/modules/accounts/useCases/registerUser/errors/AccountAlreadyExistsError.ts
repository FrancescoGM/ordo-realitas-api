import { UseCaseError } from '@core/domain/errors/UseCaseError'

export class AccountAlreadyExistsError extends Error implements UseCaseError {
  constructor(public email: string) {
    super(`Account with email '${email}' already exists`)
    this.name = 'AccountAlreadyExistsError'
  }
}
