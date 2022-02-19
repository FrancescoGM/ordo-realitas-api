import { DomainError } from '@core/domain/errors/DomainError'

export class InvalidAvatarFileError extends Error implements DomainError {
  constructor() {
    super(`The avatar file is invalid.`)
    this.name = 'InvalidAvatarFileError'
  }
}
