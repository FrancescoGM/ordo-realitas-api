import { v4 as uuidV4 } from 'uuid'

import { DayjsDateProvider } from '@infra/providers/implementations/DayjsDateProvider'
import { IDateProvider } from '@infra/providers/models/IDateProvider'

import { RefreshToken } from './refresh_token'
import { Token } from './token'

const uuidToken = uuidV4()

let dateProvider: IDateProvider

describe('Refresh token model', () => {
  beforeEach(() => {
    dateProvider = new DayjsDateProvider()
  })

  it('Should accept an valid token', () => {
    const token = Token.create(uuidToken)
    const expires_at = dateProvider.addDays(dateProvider.dateNow(), 30)
    const user_id = uuidV4()

    if (token.isLeft()) {
      throw new Error('Should not fail token object value')
    }

    const tokenOrError = RefreshToken.create({
      token: token.value,
      user_id,
      expires_at,
    })

    if (tokenOrError.isLeft()) {
      throw new Error('Fails to create token')
    }

    expect(tokenOrError.isRight()).toBe(true)
    expect(tokenOrError.value.token.value).toBe(uuidToken)
    expect(tokenOrError.value.expires_at).toBe(expires_at)
    expect(tokenOrError.value.user_id).toBe(user_id)
    expect(tokenOrError.value.isExpired()).toBe(false)
  })

  it('Should have expired date', () => {
    const token = Token.create(uuidToken)
    const expires_at = dateProvider.addDays(dateProvider.dateNow(), -1)

    if (token.isLeft()) {
      throw new Error('Should not fail token object value')
    }

    const tokenOrError = RefreshToken.create({
      token: token.value,
      user_id: 'user_id',
      expires_at,
    })

    if (tokenOrError.isLeft()) {
      throw new Error('Fails to create token')
    }

    expect(tokenOrError.isRight()).toBe(true)
    expect(tokenOrError.value.token.value).toBe(uuidToken)
    expect(tokenOrError.value.expires_at).toBe(expires_at)
    expect(tokenOrError.value.isExpired()).toBe(true)
  })
})
