import bcrypt from 'bcrypt'

import { Either, left, right } from '@core/logic/Either'

import { InvalidPasswordLengthError } from './errors/InvalidPasswordError'

export class Password {
  private readonly password: string | null
  private readonly hashed?: boolean

  get value(): string | null {
    return this.password
  }

  private constructor(password: string, hashed?: boolean) {
    this.password = password
    this.hashed = hashed
  }

  static validate(password: string | null): boolean {
    if (password === null) {
      return true
    }

    if (
      !password ||
      typeof password !== 'string' ||
      password.trim().length < 6 ||
      password.trim().length > 255
    ) {
      return false
    }

    return true
  }

  public async getHashedValue(): Promise<string | null> {
    if (this.password === null) {
      return null
    }

    if (this.hashed) {
      return this.password
    }

    return await bcrypt.hash(this.password, 8)
  }

  public async comparePassword(plainTextPassword: string): Promise<boolean> {
    let hashed: string

    if (this.hashed) {
      hashed = this.password

      return await bcrypt.compare(plainTextPassword, hashed)
    }

    return this.password === plainTextPassword
  }

  static create(
    password: string | null,
    hashed: boolean = false
  ): Either<InvalidPasswordLengthError, Password> {
    if (!hashed && !this.validate(password)) {
      return left(new InvalidPasswordLengthError())
    }

    return right(new Password(password, hashed))
  }
}
