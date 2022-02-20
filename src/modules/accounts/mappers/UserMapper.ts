import { User } from '../domain/user'

export class UserMapper {
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
