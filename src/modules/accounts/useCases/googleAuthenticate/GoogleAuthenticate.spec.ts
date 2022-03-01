import { DayjsDateProvider } from '@infra/providers/implementations/DayjsDateProvider'
import {
  GoogleProvider,
  IGoogleResponse,
} from '@infra/providers/implementations/GoogleProvider'
import { IDateProvider } from '@infra/providers/models/IDateProvider'
import {
  IGoogleProvider,
  IGoogleUser,
} from '@infra/providers/models/IGoogleProvider'
import { createUser } from '@modules/accounts/domain/services/createUser'
import { InMemoryRefreshTokensRepository } from '@modules/accounts/repositories/in-memory/InMemoryRefreshTokensRepository'
import { InMemoryUsersRepository } from '@modules/accounts/repositories/in-memory/InMemoryUsersRepository'
import { IRefreshTokensRepository } from '@modules/accounts/repositories/IRefreshTokensRepository'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'

import { GoogleAuthenticate } from './GoogleAuthenticate'

const mockedGoogleUser: IGoogleUser = {
  email: 'johndoe@johndoe.com',
  email_verified: 'true',
  name: 'John Doe',
  picture: 'https://lh3.googleusercontent.com/photo.jpg',
  sub: '123456789',
}

const mockedGoogleResponse: IGoogleResponse = {
  data: mockedGoogleUser,
}

jest.mock('axios', () => ({
  get: () => mockedGoogleResponse,
}))

let googleProvider: IGoogleProvider
let usersRepository: IUsersRepository
let refreshTokensRepository: IRefreshTokensRepository
let dateProvider: IDateProvider
let googleAuthenticate: GoogleAuthenticate

describe('Google Authenticate', () => {
  beforeEach(() => {
    googleProvider = new GoogleProvider()
    usersRepository = new InMemoryUsersRepository()
    refreshTokensRepository = new InMemoryRefreshTokensRepository()
    dateProvider = new DayjsDateProvider()

    googleAuthenticate = new GoogleAuthenticate(
      usersRepository,
      googleProvider,
      refreshTokensRepository,
      dateProvider
    )
  })

  it("Should authenticate with google and create user because the user wasn't created", async () => {
    const uncreatedUser = await usersRepository.exists(mockedGoogleUser.email)

    expect(uncreatedUser).toBe(false)

    const createUserSpy = jest.spyOn(usersRepository, 'create')

    const googleUser = await googleAuthenticate.execute('id_token')

    if (googleUser.isLeft()) {
      throw new Error('Should get a valid google user')
    }

    const createdUser = await usersRepository.findByEmail(
      mockedGoogleUser.email
    )

    expect(googleUser).toBeDefined()
    expect(googleUser.value.token).toBeDefined()
    expect(googleUser.value.refresh_token).toBeDefined()
    expect(googleUser.value.user.email).toBe(mockedGoogleUser.email)
    expect(googleUser.value.user.email).toBe(createdUser.email.value)
    expect(googleUser.value.user.name).toBe(createdUser.name.value)
    expect(createUserSpy).toHaveBeenCalledTimes(1)
  })

  it('Should authenticate with google and not create when user already exists', async () => {
    const user = createUser({
      email: mockedGoogleUser.email,
      name: mockedGoogleUser.name,
      password: null,
    })

    if (user.isLeft()) {
      throw new Error('Should get a valid user')
    }

    await usersRepository.create(user.value)

    const createUserSpy = jest.spyOn(usersRepository, 'create')

    const googleUser = await googleAuthenticate.execute('id_token')

    if (googleUser.isLeft()) {
      throw new Error('Should get a valid google user')
    }

    expect(googleUser).toBeDefined()
    expect(googleUser.value.token).toBeDefined()
    expect(googleUser.value.refresh_token).toBeDefined()
    expect(googleUser.value.user.email).toBe(mockedGoogleUser.email)
    expect(googleUser.value.user.name).toBe(mockedGoogleUser.name)
    expect(createUserSpy).toHaveBeenCalledTimes(0)
  })
})
