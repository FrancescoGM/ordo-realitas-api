import { DomainError } from '@core/domain/errors/DomainError'

export class InvalidAvatarError extends Error implements DomainError {
  constructor() {
    super(`The avatar url is invalid`)
    this.name = 'InvalidAvatarError'
  }
}
