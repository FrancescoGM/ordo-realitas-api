import { createUser } from '@modules/accounts/domain/services/createUser'
import { InMemoryUsersRepository } from '@modules/accounts/repositories/in-memory/InMemoryUsersRepository'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'

import { AuthenticateUser } from './AuthenticateUser'
import { IncorrectAccountError } from './errors/IncorrectAccountError'

let usersRepository: IUsersRepository
let authenticateUser: AuthenticateUser

describe('Authenticate user', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    authenticateUser = new AuthenticateUser(usersRepository)
  })

  it('Should be able to authenticate user', async () => {
    const user = createUser({
      email: 'johndoe@johndoe.com',
      password: '123456',
      name: 'John Doe',
    })

    if (user.isLeft()) {
      throw new Error('User not created')
    }

    await usersRepository.create(user.value)

    const authenticationOrError = await authenticateUser.execute({
      email: 'johndoe@johndoe.com',
      password: '123456',
    })

    if (authenticationOrError.isLeft()) {
      throw new Error('User not authenticated')
    }

    expect(authenticationOrError).toBeDefined()
    expect(authenticationOrError.value.token).toBeDefined()
    expect(authenticationOrError.value.user).toBeDefined()
    expect(authenticationOrError.value.user.name).toBe('John Doe')
    expect(authenticationOrError.value.user.email).toBe('johndoe@johndoe.com')
    expect(authenticationOrError.value.user.avatar_url).toBeNull()
  })

  it('Should not be able to authenticate user with unregistered email', async () => {
    const authenticationOrError = await authenticateUser.execute({
      email: 'johndoe@johndoe.com',
      password: '123456',
    })

    if (authenticationOrError.isRight()) {
      throw new Error('User authenticated')
    }

    expect(authenticationOrError.isLeft()).toBe(true)
    expect(authenticationOrError.value).toBeInstanceOf(IncorrectAccountError)
  })

  it('Should not be able to authenticate user with wrong password', async () => {
    const user = createUser({
      email: 'johndoe@johndoe.com',
      password: '123456',
      name: 'John Doe',
    })

    if (user.isLeft()) {
      throw new Error('User not created')
    }

    await usersRepository.create(user.value)

    const authenticationOrError = await authenticateUser.execute({
      email: 'johndoe@johndoe.com',
      password: 'wrong-password',
    })

    if (authenticationOrError.isRight()) {
      throw new Error('User authenticated')
    }

    expect(authenticationOrError.isLeft()).toBe(true)
    expect(authenticationOrError.value).toBeInstanceOf(IncorrectAccountError)
  })
})
