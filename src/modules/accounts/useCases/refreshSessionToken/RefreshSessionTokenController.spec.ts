/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from 'supertest'
import { v4 as uuidV4 } from 'uuid'

import { auth } from '@config/auth'
import { App } from '@infra/http/app'

const app = new App()

describe('Refresh session token (e2e)', () => {
  it('Should be able to refresh token', async () => {
    const mockedUser = {
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '123456',
      password_confirmation: '123456',
    }
    await request(app.server).post('/users').send(mockedUser)

    const sessionResponse = await request(app.server).post('/sessions').send({
      email: mockedUser.email,
      password: mockedUser.password,
    })

    const refreshSessionResponse = await request(app.server)
      .post('/sessions/refresh')
      .send({
        refresh_token: sessionResponse.body.refresh_token,
      })

    expect(refreshSessionResponse.status).toBe(200)
    expect(refreshSessionResponse.body.token).toBeDefined()
  })

  it('Should not be able to refresh token without token', async () => {
    const response = await request(app.server).post('/sessions/refresh')

    expect(response.status).toBe(400)
  })

  it('Should not be able to refresh token with invalid token', async () => {
    const response = await request(app.server)
      .post('/sessions/refresh')
      .send({ refresh_token: 'invalid-token' })

    expect(response.status).toBe(400)
  })

  it('Should not be able to refresh token with unregistered token', async () => {
    const fakeRefreshToken = uuidV4()
    const response = await request(app.server)
      .post('/sessions/refresh')
      .send({ refresh_token: fakeRefreshToken })

    expect(response.status).toBe(403)
  })

  it('Should not be able to refresh with expired token', async () => {
    const mockedUser = {
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '123456',
      password_confirmation: '123456',
    }
    await request(app.server).post('/users').send(mockedUser)

    auth.refreshTokenExpiresIn = -1

    const sessionResponse = await request(app.server).post('/sessions').send({
      email: mockedUser.email,
      password: mockedUser.password,
    })

    auth.refreshTokenExpiresIn = 30

    const refreshSessionResponse = await request(app.server)
      .post('/sessions/refresh')
      .send({
        refresh_token: sessionResponse.body.refresh_token,
      })

    expect(refreshSessionResponse.status).toBe(403)
    expect(refreshSessionResponse.body.name).toBe('SessionExpiredError')
  })
})
