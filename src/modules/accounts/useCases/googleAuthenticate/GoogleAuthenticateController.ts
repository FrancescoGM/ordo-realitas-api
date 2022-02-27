import { Controller } from '@core/infra/Controller'
import { clientError, fail, HttpResponse, ok } from '@core/infra/HttpResponse'

import { GoogleAuthenticate } from './GoogleAuthenticate'

interface IRequest {
  id_token: string
}

export class GoogleAuthenticateController implements Controller {
  constructor(private googleAuthenticate: GoogleAuthenticate) {}

  async handle({ id_token }: IRequest): Promise<HttpResponse> {
    try {
      const user = await this.googleAuthenticate.execute(id_token)

      if (user.isLeft()) {
        return clientError(user.value)
      }

      return ok(user.value)
    } catch (err) {
      return fail(err)
    }
  }
}
