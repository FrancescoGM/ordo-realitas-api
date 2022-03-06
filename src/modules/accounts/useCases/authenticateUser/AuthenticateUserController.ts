import { Controller } from '@core/infra/Controller'
import { clientError, HttpResponse, ok, fail } from '@core/infra/HttpResponse'
import { Validator } from '@core/infra/Validator'

import { AuthenticateUser } from './AuthenticateUser'

interface IRequest {
  email: string
  password: string
}

export class AuthenticateUserController implements Controller {
  constructor(
    private readonly validator: Validator<IRequest>,
    private readonly authenticateUser: AuthenticateUser
  ) {}

  async handle(request: IRequest): Promise<HttpResponse> {
    try {
      const validationResult = this.validator.validate(request)

      if (validationResult.isLeft()) {
        return clientError(validationResult.value)
      }

      const { email, password } = request

      const result = await this.authenticateUser.execute({
        email,
        password,
      })

      if (result.isLeft()) {
        return clientError(result.value)
      }

      return ok(result.value)
    } catch (err) {
      return fail(err)
    }
  }
}
