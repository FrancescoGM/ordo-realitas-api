import { InvalidAvatarError } from '../errors/InvalidAvatarError'
import { InvalidEmailError } from '../errors/InvalidEmailError'
import { InvalidNameError } from '../errors/InvalidNameError'
import { InvalidPasswordLengthError } from '../errors/InvalidPasswordError'
import { createUser } from './createUser'

const mockedUser = {
  name: 'John Doe',
  email: 'johndoe@johndoe.com',
  password: '123456',
  avatar_url: 'https://johndoe.com/johndoe.jpg',
  google_id: '1234',
}

describe('Create user domain service', () => {
  it('Should return a user', () => {
    const user = createUser(mockedUser)

    if (user.isLeft()) {
      throw new Error('User creation failed')
    }

    expect(user.isRight()).toBe(true)
    expect(user.value.name.value).toBe(mockedUser.name)
    expect(user.value.email.value).toBe(mockedUser.email)
    expect(user.value.password.value).toBe(mockedUser.password)
    expect(user.value.avatar_url.value).toBe(mockedUser.avatar_url)
    expect(user.value.google_id.value).toBe(mockedUser.google_id)
  })

  it('Should return an error when name is invalid', () => {
    const user = createUser({
      ...mockedUser,
      name: '',
    })

    expect(user.isLeft()).toBe(true)
    expect(user.value).toBeInstanceOf(InvalidNameError)
  })

  it('Should return an error when email is invalid', () => {
    const user = createUser({
      ...mockedUser,
      email: '',
    })

    expect(user.isLeft()).toBe(true)
    expect(user.value).toBeInstanceOf(InvalidEmailError)
  })

  it('Should return an error when password is invalid', () => {
    const user = createUser({
      ...mockedUser,
      password: '',
    })

    expect(user.isLeft()).toBe(true)
    expect(user.value).toBeInstanceOf(InvalidPasswordLengthError)
  })

  it('Should return an error when avatar is invalid', () => {
    const user = createUser({
      ...mockedUser,
      avatar_url: '',
    })

    expect(user.isLeft()).toBe(true)
    expect(user.value).toBeInstanceOf(InvalidAvatarError)
  })
})
