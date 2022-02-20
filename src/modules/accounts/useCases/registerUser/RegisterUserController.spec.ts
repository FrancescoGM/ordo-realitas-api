/**
 * @jest-environment ./prisma/prisma-test-environment.js
 */

import request from 'supertest'

import { App } from '@infra/http/app'
import { prisma } from '@infra/prisma/client'

const app = new App()

describe('Register user (e2e)', () => {
  afterAll(() => {
    prisma.$disconnect()
  })

  it('Should be able to register new user', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '123456',
      password_confirmation: '123456',
    })

    expect(response.status).toBe(201)

    const userInDatabase = await prisma.user.findUnique({
      where: { email: 'johndoe@johndoe.com' },
    })

    expect(userInDatabase).toBeTruthy()
  })

  it('Should return an error if validation fails', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@johndoe.com',
      password: '123456', // password confirmation is missing
    })

    expect(response.status).toBe(400)
  })
})
