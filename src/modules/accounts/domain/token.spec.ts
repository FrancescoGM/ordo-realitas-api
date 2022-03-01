import { v4 as uuidV4 } from 'uuid'

import { InvalidTokenError } from './errors/InvalidTokenError'
import { Token } from './token'

describe('RefreshToken token object value', () => {
  it('Should accept an valid token', () => {
    const mockedToken = uuidV4()
    const tokenOrError = Token.create(mockedToken)

    if (tokenOrError.isLeft()) {
      throw new Error('Should not fail')
    }

    const token = tokenOrError.value

    expect(tokenOrError.isRight()).toBe(true)
    expect(token.value).toBe(mockedToken)
  })

  it('Should reject an invalid token', () => {
    const tokenOrError1 = Token.create('')
    const tokenOrError2 = Token.create(null)
    const tokenOrError3 = Token.create('johndoe')

    expect(tokenOrError1.isLeft()).toBe(true)
    expect(tokenOrError1.value).toBeInstanceOf(InvalidTokenError)
    expect(tokenOrError2.isLeft()).toBe(true)
    expect(tokenOrError2.value).toBeInstanceOf(InvalidTokenError)
    expect(tokenOrError3.isLeft()).toBe(true)
    expect(tokenOrError3.value).toBeInstanceOf(InvalidTokenError)
  })
})
