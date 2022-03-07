import { v4 as uuidV4 } from 'uuid'

import { DayjsDateProvider } from '@infra/providers/implementations/DayjsDateProvider'
import { IDateProvider } from '@infra/providers/models/IDateProvider'
import { RefreshToken } from '@modules/accounts/domain/refresh_token'
import { createUser } from '@modules/accounts/domain/services/createUser'
import { Token } from '@modules/accounts/domain/token'
import { InMemoryRefreshTokensRepository } from '@modules/accounts/repositories/in-memory/InMemoryRefreshTokensRepository'
import { InMemoryUsersRepository } from '@modules/accounts/repositories/in-memory/InMemoryUsersRepository'
import { IRefreshTokensRepository } from '@modules/accounts/repositories/IRefreshTokensRepository'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'

import { RefreshTokenDoesNotExistError } from './errors/RefreshTokenDoesNotExistError'
import { SessionExpiredError } from './errors/SessionExpiredError'
import { RefreshSessionToken } from './RefreshSessionToken'

let usersRepository: IUsersRepository
let refreshTokensRepository: IRefreshTokensRepository
let dateProvider: IDateProvider
let refreshSessionToken: RefreshSessionToken

describe('Refresh session token', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    refreshTokensRepository = new InMemoryRefreshTokensRepository()
    dateProvider = new DayjsDateProvider()
    refreshSessionToken = new RefreshSessionToken(
      usersRepository,
      refreshTokensRepository
    )
  })

  it('Should be able to refresh token', async () => {
    const userOrError = createUser({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '123456',
    })

    if (userOrError.isLeft()) {
      throw new Error('Should not throw error')
    }

    await usersRepository.create(userOrError.value)

    const tokenOrError = Token.create(uuidV4())

    if (tokenOrError.isLeft()) {
      throw new Error('Should not fail on token creation')
    }
    const expires_at = dateProvider.addDays(dateProvider.dateNow(), 1)

    const refreshToken = RefreshToken.create({
      expires_at,
      token: tokenOrError.value,
      user_id: userOrError.value.id,
    })

    if (refreshToken.isLeft()) {
      throw new Error('Should not fail on refresh token creation')
    }

    await refreshTokensRepository.create(refreshToken.value)

    const response = await refreshSessionToken.execute({
      refresh_token: refreshToken.value.token.value,
    })

    if (response.isLeft()) {
      throw new Error('Should not fail on refresh token creation')
    }

    expect(response.value.token).toBeDefined()
  })

  it('Should not be able to refresh token without token', async () => {
    const response = await refreshSessionToken.execute({
      refresh_token: '',
    })

    expect(response.isLeft()).toBe(true)
  })

  it('Should not be able to refresh token with invalid token', async () => {
    const response = await refreshSessionToken.execute({
      refresh_token: 'invalid-token',
    })

    expect(response.isLeft()).toBe(true)
  })

  it('Should not be able to refresh token with unregistered token', async () => {
    const mockedToken = uuidV4()

    const response = await refreshSessionToken.execute({
      refresh_token: mockedToken,
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(RefreshTokenDoesNotExistError)
  })

  it('Should not be able to refresh with expired token', async () => {
    const userOrError = createUser({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '123456',
    })

    if (userOrError.isLeft()) {
      throw new Error('Should not throw error')
    }
    await usersRepository.create(userOrError.value)

    const tokenOrError = Token.create(uuidV4())

    if (tokenOrError.isLeft()) {
      throw new Error('Should not fail on token creation')
    }

    const expires_at = dateProvider.addDays(dateProvider.dateNow(), -1)

    const refreshToken = RefreshToken.create({
      expires_at,
      token: tokenOrError.value,
      user_id: userOrError.value.id,
    })

    if (refreshToken.isLeft()) {
      throw new Error('Should not fail on refresh token creation')
    }

    await refreshTokensRepository.create(refreshToken.value)

    const response = await refreshSessionToken.execute({
      refresh_token: refreshToken.value.token.value,
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(SessionExpiredError)
  })
})
