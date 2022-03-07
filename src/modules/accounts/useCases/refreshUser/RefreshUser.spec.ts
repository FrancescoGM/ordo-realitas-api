import { createUser } from '@modules/accounts/domain/services/createUser'
import { InMemoryUsersRepository } from '@modules/accounts/repositories/in-memory/InMemoryUsersRepository'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'

import { UserDoesNotExistsError } from './errors/UserDoesNotExistsError'
import { RefreshUser } from './RefreshUser'

let usersRepository: IUsersRepository
let refreshUser: RefreshUser

describe('Refresh user', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    refreshUser = new RefreshUser(usersRepository)
  })

  it('should refresh user', async () => {
    const user = createUser({
      email: 'johndoe@johndoe.com',
      name: 'John Doe',
      password: '123456',
    })

    if (user.isLeft()) {
      throw new Error('User should be created')
    }

    await usersRepository.create(user.value)

    const response = await refreshUser.execute(user.value.id)

    if (response.isLeft()) {
      throw new Error('User should be refreshed')
    }

    expect(response.value.name).toBe(user.value.name.value)
    expect(response.value.email).toBe(user.value.email.value)
    expect(response.value.avatar_url).toBe(user.value.avatar_url.value)
  })

  it('Should not be able to refresh user with an unregistered user', async () => {
    const response = await refreshUser.execute('user_id')

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(UserDoesNotExistsError)
  })
})
