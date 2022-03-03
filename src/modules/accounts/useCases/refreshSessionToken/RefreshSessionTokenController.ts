import { Controller } from '@core/infra/Controller'
import {
  clientError,
  HttpResponse,
  ok,
  forbidden,
} from '@core/infra/HttpResponse'

import { RefreshTokenDoesNotExistError } from './errors/RefreshTokenDoesNotExistError'
import { SessionExpiredError } from './errors/SessionExpiredError'
import { RefreshSessionToken } from './RefreshSessionToken'

interface IRequest {
  refresh_token: string
}

export class RefreshSessionTokenController implements Controller {
  constructor(private readonly refreshSessionToken: RefreshSessionToken) {}

  async handle({ refresh_token }: IRequest): Promise<HttpResponse> {
    const httpResponseOrError = await this.refreshSessionToken.execute({
      refresh_token,
    })

    if (httpResponseOrError.isLeft()) {
      switch (httpResponseOrError.value.constructor) {
        case RefreshTokenDoesNotExistError:
        case SessionExpiredError:
          return forbidden(httpResponseOrError.value)
        default:
          return clientError(httpResponseOrError.value)
      }
    }

    return ok(httpResponseOrError.value)
  }
}
