import { Google } from './google'

describe('Google value object', () => {
  it('should accept valid google id', () => {
    const googleId = Google.create('12345')

    expect(googleId.isRight()).toBe(true)
  })

  it('should accept null google id', () => {
    const googleId = Google.create(null)

    expect(googleId.isRight()).toBe(true)
  })

  it('should reject google id with less than 2 characters', () => {
    const googleIdOrError = Google.create('1')

    expect(googleIdOrError.isLeft()).toBe(true)
  })

  it('should reject google id with more than 255 characters', () => {
    const googleIdOrError = Google.create('a'.repeat(256))

    expect(googleIdOrError.isLeft()).toBe(true)
  })
})
