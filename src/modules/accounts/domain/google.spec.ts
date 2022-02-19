import { Google } from './google'

describe('Google value object', () => {
  it('should accept valid google id', () => {
    const googleId = Google.create('12345')

    expect(googleId.isRight()).toBeTruthy()
  })

  it('should accept null google id', () => {
    const googleId = Google.create(null)

    expect(googleId.isRight()).toBeTruthy()
  })

  it('should reject google id with less than 2 characters', () => {
    const googleIdOrError = Google.create('1')

    expect(googleIdOrError.isLeft()).toBeTruthy()
  })

  it('should reject google id with more than 255 characters', () => {
    const googleIdOrError = Google.create('a'.repeat(256))

    expect(googleIdOrError.isLeft()).toBeTruthy()
  })
})
