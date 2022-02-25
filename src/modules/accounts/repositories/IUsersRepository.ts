import { User } from '../domain/user'

export interface IUsersRepository {
  exists(email: string): Promise<boolean>
  create(data: User): Promise<void>
  findByEmail(email: string): Promise<User | null>
}
