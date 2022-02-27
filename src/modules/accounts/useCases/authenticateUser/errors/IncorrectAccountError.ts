import { UseCaseError } from '@core/domain/errors/UseCaseError'

export class IncorrectAccountError extends Error implements UseCaseError {
  constructor() {
    super('Email or password is incorrect')
    this.name = 'IncorrectAccountError'
  }
}
