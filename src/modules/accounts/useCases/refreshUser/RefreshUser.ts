import { Either, left, right } from '@core/logic/Either'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'

import { UserDoesNotExistsError } from './errors/UserDoesNotExistsError'

interface IResponse {
  name: string
  email: string
  avatar_url: string | null
}

export class RefreshUser {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute(
    userId: string
  ): Promise<Either<UserDoesNotExistsError, IResponse>> {
    const userExists = await this.usersRepository.findById(userId)

    if (!userExists) {
      return left(new UserDoesNotExistsError())
    }

    return right({
      name: userExists.name.value,
      email: userExists.email.value,
      avatar_url: userExists.avatar_url.value,
    })
  }
}
