import { User as PersistenceUser } from '@prisma/client'

import { createUser } from '../domain/services/createUser'
import { User } from '../domain/user'

export class UserMapper {
  static toDomain(raw: PersistenceUser): User {
    const user = createUser(raw)

    if (user.isLeft()) {
      throw new Error(user.value.message)
    }

    return user.value
  }

  static async toPersistence(user: User) {
    return {
      id: user.id,
      name: user.name.value,
      email: user.email.value,
      password: await user.password.getHashedValue(),
      google_id: user.google_id.value,
      avatar_url: user.avatar_url.value,
    }
  }
}
