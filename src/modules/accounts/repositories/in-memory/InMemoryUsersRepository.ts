import { User } from '@modules/accounts/domain/user'

import { IUsersRepository } from '../IUsersRepository'

export class InMemoryUsersRepository implements IUsersRepository {
  constructor(public items: User[] = []) {}

  async create(data: User): Promise<void> {
    this.items.push(data)
  }

  async exists(email: string): Promise<boolean> {
    return this.items.some((item) => item.email.value === email)
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.items.find((item) => item.email.value === email) || null
  }

  async findById(id: string): Promise<User | null> {
    return this.items.find((item) => item.id === id) || null
  }
}
