import { createUser } from '@modules/accounts/domain/services/createUser'
import { InMemoryUsersRepository } from '@modules/accounts/repositories/in-memory/InMemoryUsersRepository'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'

import { AccountAlreadyExistsError } from './errors/AccountAlreadyExistsError'
import { RegisterUser } from './RegisterUser'

let usersRepository: IUsersRepository
let registerUser: RegisterUser

describe('Register user', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    registerUser = new RegisterUser(usersRepository)
  })

  it('Should be able to create an new user with valid data', async () => {
    const response = await registerUser.execute({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '123456',
    })

    expect(response.isRight()).toBeTruthy()
    expect(await usersRepository.exists('johndoe@johndoe.com')).toBeTruthy()
  })

  it('Should not be able to create an new user with invalid data', async () => {
    const response = await registerUser.execute({
      name: 'John Doe',
      email: 'johndoe@johndoe',
      password: '123',
    })

    expect(response.isLeft()).toBeTruthy()
  })

  it('Should not be able to create new user with existing email', async () => {
    const userOrError = createUser({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '123456',
    })

    if (userOrError.isLeft()) return new Error()

    usersRepository.create(userOrError.value)

    const response = await registerUser.execute({
      email: 'johndoe@johndoe.com',
      name: 'John Doe',
      password: '123456',
    })

    expect(response.isLeft()).toBeTruthy()
    expect(response.value).toBeInstanceOf(AccountAlreadyExistsError)
    expect(response.value).toEqual(
      new AccountAlreadyExistsError('johndoe@johndoe.com')
    )
  })
})
