import { DomainError } from '@core/domain/errors/DomainError'

export class InvalidParamError extends Error implements DomainError {
  constructor(param: string) {
    super(`The received value for field "${param}" is invalid.`)
    this.name = 'InvalidParamError'
  }
}
