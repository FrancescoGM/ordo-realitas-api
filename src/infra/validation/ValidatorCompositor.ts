import { Validator } from '@core/infra/Validator'
import { Either } from '@core/logic/Either'

export class ValidatorCompositor<T = unknown, E = Error>
  implements Validator<T, E>
{
  constructor(private validators: Validator<T, E>[]) {}

  validate(input: T): Either<E, null> {
    for (const validator of this.validators) {
      const error = validator.validate(input)
      if (error !== null) return error
    }

    return null
  }
}
