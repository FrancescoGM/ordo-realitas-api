import { validate as validateUuid } from 'uuid'

import { Either, left, right } from '@core/logic/Either'

import { InvalidTokenError } from './errors/InvalidTokenError'

export class Token {
  private readonly token: string

  get value(): string {
    return this.token
  }

  private constructor(token: string) {
    this.token = token
  }

  static validate(token: string): boolean {
    if (!token || typeof token !== 'string' || token.trim().length < 1) {
      return false
    }

    if (!validateUuid(token)) {
      return false
    }

    return true
  }

  static create(token: string): Either<InvalidTokenError, Token> {
    if (!this.validate(token)) {
      return left(new InvalidTokenError(token))
    }

    return right(new Token(token))
  }
}
