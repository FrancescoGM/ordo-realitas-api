import { DomainError } from '@core/domain/errors/DomainError'

export class InvalidFieldError extends Error implements DomainError {
  constructor(param: string) {
    super(`The field '${param}' was not sent.`)
    this.name = 'InvalidFieldError'
  }
}
