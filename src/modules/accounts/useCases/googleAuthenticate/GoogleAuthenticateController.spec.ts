/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */
import request from 'supertest'

import { App } from '@infra/http/app'
import { IGoogleResponse } from '@infra/providers/implementations/GoogleProvider'
import { IGoogleUser } from '@infra/providers/models/IGoogleProvider'

import { ITokenResponse } from './GoogleAuthenticate'

const mockedGoogleUser: IGoogleUser = {
  email: 'johndoe@johndoe.com',
  email_verified: 'true',
  name: 'John Doe',
  picture: 'https://lh3.googleusercontent.com/photo.jpg',
  sub: '123456789',
}

const mockedGoogleResponse: IGoogleResponse = {
  data: mockedGoogleUser,
}

jest.mock('axios', () => ({
  get: () => mockedGoogleResponse,
}))

let app: App

describe('Google authenticate (e2e)', () => {
  beforeEach(() => {
    app = new App()
  })

  it('Should be able to authenticate with google with id_token', async () => {
    const response = await request(app.server).post('/sessions/google').send({
      id_token: 'id_token',
    })

    const data = response.body as ITokenResponse

    expect(response.status).toBe(200)
    expect(data.token).toBeDefined()
    expect(data.user).toBeDefined()
    expect(data.user.name).toBe(mockedGoogleUser.name)
    expect(data.user.email).toBe(mockedGoogleUser.email)
    expect(data.user.avatar_url).toBe(null)
  })
})
