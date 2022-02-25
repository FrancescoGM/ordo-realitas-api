import { Email } from './email'

describe('User email value object', () => {
  it('Should accept valid email address', () => {
    const email = Email.create('johndoe@johndoe.com')

    expect(email.isRight()).toBe(true)
  })

  it('Should reject invalid email address', () => {
    const emailOrError1 = Email.create('johndoe')
    const emailOrError2 = Email.create('johndoe@example')
    const emailOrError3 = Email.create('@example.com')
    const emailOrError4 = Email.create('johndoe@example.')

    expect(emailOrError1.isLeft()).toBe(true)
    expect(emailOrError2.isLeft()).toBe(true)
    expect(emailOrError3.isLeft()).toBe(true)
    expect(emailOrError4.isLeft()).toBe(true)
  })

  it('Should reject email with more than 255 characters', () => {
    const domain = 'a'.repeat(256)

    const emailOrError = Email.create(`$johndoe@${domain}.com`)

    expect(emailOrError.isLeft()).toBe(true)
  })
})
