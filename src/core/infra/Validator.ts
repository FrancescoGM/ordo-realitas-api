import { Either } from '@core/logic/Either'

export type Validator<T = unknown, E = Error> = {
  validate(data: T): Either<E, null>
}
