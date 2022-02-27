import { EmailValidator } from './EmailValidator'

const data = {
  email: 'johndoe@johndoe.com',
}

describe('Email validator', () => {
  it('Should return no errors if receive a valid email', () => {
    const validator = new EmailValidator('email')

    const resultOrError = validator.validate(data)

    expect(resultOrError.isRight()).toBe(true)
  })

  it('Should return no errors if receive a valid email and required', () => {
    const validator = new EmailValidator('email', { required: true })

    const resultOrError = validator.validate(data)

    expect(resultOrError.isRight()).toBe(true)
  })

  it('Should return error if receive an invalid email', () => {
    const validator = new EmailValidator('email')

    const resultOrError = validator.validate({
      email: 'invalid_email',
    })

    expect(resultOrError.isLeft()).toBe(true)
  })

  it('Should return error if receive an invalid email and required', () => {
    const validator = new EmailValidator('email', { required: true })

    const resultOrError = validator.validate({
      email: 'invalid_email',
    })

    expect(resultOrError.isLeft()).toBe(true)
  })

  it('Should be able to pass if receive an empty, null or undefined email when is not required', () => {
    const validator = new EmailValidator('email')

    const resultOrError = validator.validate({
      email: '',
    })

    const resultOrError2 = validator.validate({
      email: null,
    })

    const resultOrError3 = validator.validate({
      email: undefined,
    })

    expect(resultOrError.isRight()).toBe(true)
    expect(resultOrError2.isRight()).toBe(true)
    expect(resultOrError3.isRight()).toBe(true)
  })

  it('Should return error if receive an empty, null or undefined email when is required', () => {
    const validator = new EmailValidator('email', { required: true })

    const resultOrError = validator.validate({
      email: '',
    })

    const resultOrError2 = validator.validate({
      email: null,
    })

    const resultOrError3 = validator.validate({
      email: undefined,
    })

    expect(resultOrError.isLeft()).toBe(true)
    expect(resultOrError2.isLeft()).toBe(true)
    expect(resultOrError3.isLeft()).toBe(true)
  })
})
