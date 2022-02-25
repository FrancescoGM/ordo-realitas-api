import { InvalidJWTTokenError } from './errors/InvalidJWTTokenError'
import { JWT } from './jwt'
import { createUser } from './services/createUser'

describe('JWT model', () => {
  it('Should sign user and return an token', async () => {
    const user = createUser({
      email: 'johndoe@johndoe.com',
      name: 'John Doe',
      password: '123456',
    })

    if (user.isLeft()) {
      throw new Error('User is invalid')
    }

    const token = JWT.signUser(user.value)

    expect(token.token).toBeDefined()
    expect(token.userId).toEqual(user.value.id)
  })

  it('Should verify token and return the user', async () => {
    const user = createUser({
      email: 'johndoe@johndoe.com',
      name: 'John Doe',
      password: '123456',
    })

    if (user.isLeft()) {
      throw new Error('User is invalid')
    }

    const token = JWT.signUser(user.value)

    const decoded = JWT.decodeToken(token.token)

    if (decoded.isLeft()) {
      throw new Error('Token is invalid')
    }

    expect(decoded.isRight()).toBe(true)
    expect(decoded.value.sub).toEqual(user.value.id)
    expect(decoded.value.exp).toEqual(expect.any(Number))
  })

  it('Should be able to inicialize JWT from create token', () => {
    const user = createUser({
      email: 'john@doe.com',
      name: 'John Doe',
      password: '123456',
    })

    if (user.isLeft()) {
      throw new Error('User is invalid')
    }

    const token = JWT.signUser(user.value)

    const jwt = JWT.createFromJWT(token.token)

    if (jwt.isLeft()) {
      throw new Error('Token is invalid')
    }

    expect(jwt.value.userId).toEqual(user.value.id)
    expect(jwt.value.token).toEqual(token.token)
  })

  it('should not be able to initialize JWT from invalid token', () => {
    const jwtOrError = JWT.createFromJWT('invalid-token')

    expect(jwtOrError.isLeft()).toBe(true)
    expect(jwtOrError.value).toEqual(new InvalidJWTTokenError())
  })

  it('should not be able to decode invalid JWT token', () => {
    const jwtOrError = JWT.decodeToken('invalid-token')

    expect(jwtOrError.isLeft()).toBe(true)
    expect(jwtOrError.value).toEqual(new InvalidJWTTokenError())
  })
})
