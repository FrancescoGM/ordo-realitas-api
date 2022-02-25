import axios from 'axios'
import { mocked } from 'jest-mock'

import { GoogleRequestError } from '../errors/GoogleRequestError'
import { InvalidIdTokenError } from '../errors/InvalidIdTokenError'
import { UnverifiedGoogleEmailError } from '../errors/UnverifiedGoogleEmailError'
import { GoogleProvider, IGoogleResponse } from './GoogleProvider'

const mockedGoogleResponse: IGoogleResponse = {
  data: {
    email: 'johndoe@johndoe.com',
    email_verified: 'true',
    name: 'John Doe',
    picture: 'https://lh3.googleusercontent.com/photo.jpg',
    sub: '123456789',
  },
}

jest.mock('axios')

const mockedAxios = mocked(axios.get)

describe('Google provider', () => {
  it('Should get google user with an valid id_token', async () => {
    mockedAxios.mockReturnValueOnce(Promise.resolve(mockedGoogleResponse))

    const googleProvider = new GoogleProvider()

    const googleUser = await googleProvider.getUser('id_token')

    if (googleUser.isLeft()) {
      throw new Error('Should get a valid google user')
    }

    expect(googleUser).toBeDefined()
    expect(googleUser.value.email).toBe('johndoe@johndoe.com')
  })

  it('Should return an error when an invalid token was passed', async () => {
    mockedAxios.mockReturnValue(Promise.resolve(mockedGoogleResponse))

    const googleProvider = new GoogleProvider()

    const googleUser1 = await googleProvider.getUser('a')
    const googleUser2 = await googleProvider.getUser(null)
    const googleUser3 = await googleProvider.getUser('')

    expect(googleUser1.isLeft()).toBe(true)
    expect(googleUser2.isLeft()).toBe(true)
    expect(googleUser3.isLeft()).toBe(true)
    expect(googleUser1.value).toBeInstanceOf(InvalidIdTokenError)
    expect(googleUser2.value).toBeInstanceOf(InvalidIdTokenError)
    expect(googleUser3.value).toBeInstanceOf(InvalidIdTokenError)
  })

  it('Should return an error when an unverified email was passed', async () => {
    const googleResponse = {
      data: {
        ...mockedGoogleResponse.data,
        email_verified: 'false',
      },
    }

    mockedAxios.mockReturnValueOnce(Promise.resolve(googleResponse))

    const googleProvider = new GoogleProvider()

    const googleUser = await googleProvider.getUser('id_token')

    expect(googleUser.isLeft()).toBe(true)
    expect(googleUser.value).toBeInstanceOf(UnverifiedGoogleEmailError)
  })

  it('Should return an error when an google request throws error', async () => {
    mockedAxios.mockReturnValueOnce(Promise.reject(new Error('Error')))

    const googleProvider = new GoogleProvider()

    const googleUser = await googleProvider.getUser('id_token')

    expect(googleUser.isLeft()).toBe(true)
    expect(googleUser.value).toBeInstanceOf(GoogleRequestError)
  })
})
