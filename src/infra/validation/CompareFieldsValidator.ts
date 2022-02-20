import { Validator } from '@core/infra/Validator'
import { Either, left, right } from '@core/logic/Either'

import { InvalidFieldError } from './errors/InvalidFiedError'
import { InvalidParamError } from './errors/InvalidParamError'

export class CompareFieldsValidator<T = unknown> implements Validator<T> {
  constructor(
    private readonly field: string,
    private readonly fieldToCompare: string
  ) {}

  public validate(
    data: T
  ): Either<InvalidParamError | InvalidFieldError, null> {
    if (!data[this.fieldToCompare]) {
      return left(new InvalidFieldError(this.fieldToCompare))
    }

    if (data[this.field] !== data[this.fieldToCompare]) {
      return left(new InvalidParamError(this.fieldToCompare))
    }

    return right(null)
  }
}
