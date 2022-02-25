import { Name } from './name'

describe('User name value object', () => {
  it('Should accept valid name', () => {
    const name = Name.create('johndoe')

    expect(name.isRight()).toBe(true)
  })

  it('Should reject name with less than 2 characters', () => {
    const nameOrError = Name.create('j')

    expect(nameOrError.isLeft()).toBe(true)
  })

  it('should reject name with more than 255 characters', () => {
    const nameOrError = Name.create('d'.repeat(256))

    expect(nameOrError.isLeft()).toBe(true)
  })
})
