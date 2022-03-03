import { DomainError } from '@core/domain/errors/DomainError'

export class AccountDoesNotExists extends Error implements DomainError {
  constructor() {
    super('Account does not exists')
    this.name = 'AccountDoesNotExists'
  }
}
