import { Validator } from '@core/infra/Validator'
import { Either, left, right } from '@core/logic/Either'
import { InvalidEmailError } from '@modules/accounts/domain/errors/InvalidEmailError'

import { InvalidFieldError } from './errors/InvalidFiedError'

interface IEmailValidatorOptions {
  required?: boolean
}

export class EmailValidator<T = unknown>
  implements Validator<T, InvalidEmailError | InvalidFieldError>
{
  constructor(
    private readonly field: string,
    private readonly options: IEmailValidatorOptions = {}
  ) {}

  public validate(
    data: T
  ): Either<InvalidEmailError | InvalidFieldError, null> {
    const { required = false } = this.options

    if (required && !data[this.field]) {
      return left(new InvalidFieldError(this.field))
    }

    if (
      !required &&
      (data[this.field] === '' ||
        data[this.field] === null ||
        data[this.field] === undefined)
    ) {
      return right(null)
    }

    if (typeof data[this.field] !== 'string') {
      return left(new InvalidFieldError(this.field))
    }

    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (!regex.test(data[this.field])) {
      return left(new InvalidEmailError(this.field))
    }

    return right(null)
  }
}
