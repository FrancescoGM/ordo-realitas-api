import { Controller } from '@core/infra/Controller'
import { clientError, HttpResponse, ok, fail } from '@core/infra/HttpResponse'

import { RefreshUser } from './RefreshUser'

interface IRequest {
  userId: string
}

export class RefreshUserController implements Controller {
  constructor(private readonly refreshUser: RefreshUser) {}

  async handle({ userId }: IRequest): Promise<HttpResponse> {
    try {
      const user = await this.refreshUser.execute(userId)

      if (user.isLeft()) {
        return clientError(user.value)
      }

      return ok({ user: user.value })
    } catch (err) {
      return fail(err)
    }
  }
}
