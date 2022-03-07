/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import { sign } from 'jsonwebtoken'
import request from 'supertest'

import { auth } from '@config/auth'
import { App } from '@infra/http/app'

const app = new App()

const mockedUser = {
  name: 'John Doe',
  email: 'johndoe@johndoe.com',
  password: '123456',
  password_confirmation: '123456',
}

describe('Refresh user (e2e)', () => {
  beforeAll(async () => {
    const registerUserResponse = await request(app.server)
      .post('/users')
      .send(mockedUser)

    expect(registerUserResponse.status).toBe(201)
  })

  it('Should be able to refresh user', async () => {
    const sessionResponse = await request(app.server).post('/sessions').send({
      email: mockedUser.email,
      password: mockedUser.password,
    })

    const { token } = sessionResponse.body

    expect(token).toBeDefined()

    const response = await request(app.server)
      .get('/sessions/refresh/user')
      .set('x-access-token', `Bearer ${token}`)

    const { user } = response.body

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('user')
    expect(user.name).toBe(mockedUser.name)
    expect(user.email).toBe(mockedUser.email)
    expect(user.avatar_url).toBeNull()
  })

  it('Should not be able to refresh user with an unregistered user', async () => {
    const response = await request(app.server)
      .get('/sessions/refresh/user')
      .set(
        'x-access-token',
        `Bearer ${sign({}, auth.secretKey, { subject: 'user_id' })}`
      )

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('error')
    expect(response.body.name).toBe('UserDoesNotExistsError')
  })
})
