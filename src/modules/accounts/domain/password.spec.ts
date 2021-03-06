import bcrypt from 'bcrypt'

import { Password } from './password'

describe('User password value object', () => {
  it('Should accept valid password', () => {
    const password = Password.create('123456')

    expect(password.isRight()).toBe(true)
  })

  it('Should accept valid null password', () => {
    const password = Password.create(null)

    expect(password.isRight()).toBe(true)
  })

  it('Should reject password with less than 6 characters', () => {
    const passwordOrError = Password.create('12345')

    expect(passwordOrError.isLeft()).toBe(true)
  })

  it('Should reject password with more than 255 characters', () => {
    const passwordOrError = Password.create('d'.repeat(256))

    expect(passwordOrError.isLeft()).toBe(true)
  })

  it('Should be able to hash password', async () => {
    const password = Password.create('123456')

    if (password.isLeft()) {
      throw new Error()
    }

    const hashedPassword = await password.value.getHashedValue()

    expect(await bcrypt.compare('123456', hashedPassword)).toBe(true)
  })

  it('Should not hash password when already hashed', async () => {
    const hashedPassword = await bcrypt.hash('123456', 8)
    const password = Password.create(hashedPassword, true)

    if (password.isLeft()) {
      throw new Error()
    }

    expect(await password.value.getHashedValue()).toEqual(hashedPassword)
  })

  it('Should not hash when password is null and return null', async () => {
    const password = Password.create(null)

    if (password.isLeft()) {
      throw new Error()
    }

    const hashedPassword = await password.value.getHashedValue()

    expect(hashedPassword).toBeNull()
  })

  it('should be able to compare the password when not hashed', async () => {
    const password = Password.create('123456')

    if (password.isLeft()) {
      throw new Error()
    }

    expect(await password.value.comparePassword('123456')).toBe(true)
  })

  it('should be able to compare the password when hashed', async () => {
    const hashedPassword = await bcrypt.hash('123456', 8)
    const password = Password.create(hashedPassword, true)

    if (password.isLeft()) {
      throw new Error()
    }

    expect(await password.value.comparePassword('123456')).toBe(true)
  })
})
