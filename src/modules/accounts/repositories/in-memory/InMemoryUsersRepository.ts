import { User } from '@modules/accounts/domain/user'

import { IUsersRepository } from '../IUsersRepository'

export class InMemoryUsersRepository implements IUsersRepository {
  constructor(public items: User[] = []) {}

  async create(data: User): Promise<User> {
    this.items.push(data)

    return data
  }

  async exists(email: string): Promise<boolean> {
    return this.items.some((item) => item.email.value === email)
  }
}
