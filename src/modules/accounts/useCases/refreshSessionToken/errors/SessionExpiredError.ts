import { DomainError } from '@core/domain/errors/DomainError'

export class SessionExpiredError extends Error implements DomainError {
  constructor() {
    super('Session expired')
    this.name = 'SessionExpiredError'
  }
}
