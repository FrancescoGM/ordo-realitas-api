import { Name } from './name'

describe('User name value object', () => {
  it('Should accept valid name', () => {
    const name = Name.create('johndoe')

    expect(name.isRight()).toBeTruthy()
  })

  it('Should reject name with less than 2 characters', () => {
    const nameOrError = Name.create('j')

    expect(nameOrError.isLeft()).toBeTruthy()
  })

  it('should reject name with more than 255 characters', () => {
    const nameOrError = Name.create('d'.repeat(256))

    expect(nameOrError.isLeft()).toBeTruthy()
  })
})
