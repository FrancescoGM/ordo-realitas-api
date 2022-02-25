import { DomainError } from '@core/domain/errors/DomainError'

export class GoogleRequestError extends Error implements DomainError {
  constructor() {
    super('Error getting user from google')
    this.name = 'GoogleRequestError'
  }
}
