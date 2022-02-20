import { Controller } from '@core/infra/Controller'
import {
  clientError,
  conflict,
  created,
  HttpResponse,
} from '@core/infra/HttpResponse'
import { Validator } from '@core/infra/Validator'

import { AccountAlreadyExistsError } from './errors/AccountAlreadyExistsError'
import { RegisterUser } from './RegisterUser'

interface IRequest {
  name: string
  email: string
  password?: string | null
  password_confirmation?: string
  avatar_url?: string | null
  google_id?: string | null
}

export class RegisterUserController implements Controller {
  constructor(
    private readonly validator: Validator<IRequest>,
    private registerUser: RegisterUser
  ) {}

  async handle(request: IRequest): Promise<HttpResponse> {
    try {
      const validationResult = this.validator.validate(request)

      if (validationResult.isLeft()) {
        return clientError(validationResult.value)
      }

      const { name, email, password, avatar_url, google_id } = request

      const result = await this.registerUser.execute({
        name,
        email,
        password,
        avatar_url,
        google_id,
      })

      if (result.isLeft()) {
        const error = result.value
        switch (error.constructor) {
          case AccountAlreadyExistsError:
            return conflict(error)
          default:
            return clientError(error)
        }
      } else {
        return created()
      }
    } catch (err) {
      return fail(err)
    }
  }
}
