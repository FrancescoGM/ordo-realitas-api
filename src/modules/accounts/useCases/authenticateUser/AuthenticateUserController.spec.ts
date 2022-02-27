/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */
import request from 'supertest'

import { App } from '@infra/http/app'

import { ITokenResponse } from './AuthenticateUser'

const app = new App()

const mockedUser = {
  email: 'johndoe@johndoe.com',
  password: '123456',
  password_confirmation: '123456',
  name: 'John Doe',
}

describe('Authenticate user (e2e)', () => {
  beforeAll(async () => {
    await request(app.server).post('/users').send(mockedUser)
  })
  it('Should be able to authenticate user', async () => {
    const response = await request(app.server).post('/sessions').send({
      email: mockedUser.email,
      password: mockedUser.password,
    })

    const data = response.body as ITokenResponse

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('token')
    expect(data).toHaveProperty('user')
    expect(data.user.email).toBe(mockedUser.email)
    expect(data.user.name).toBe(mockedUser.name)
    expect(data.user.avatar_url).toBeNull()
  })

  it('Should not be able to authenticate user with unregistered email', async () => {
    const response = await request(app.server).post('/sessions').send({
      email: 'johndoe2@johndoe.com',
      password: mockedUser.password,
    })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('error')
  })

  it('Should not be able to authenticate user with wrong password', async () => {
    const response = await request(app.server).post('/sessions').send({
      email: mockedUser.email,
      password: '1234567',
    })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('error')
  })
})
