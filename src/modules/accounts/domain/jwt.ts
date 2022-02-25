import { sign, verify } from 'jsonwebtoken'

import { auth } from '@config/auth'
import { Either, left, right } from '@core/logic/Either'

import { InvalidJWTTokenError } from './errors/InvalidJWTTokenError'
import { User } from './user'

type JWTData = {
  userId: string
  token: string
}

type JWTTokenPayload = {
  exp: number
  sub: string
}

export class JWT {
  public readonly userId: string
  public readonly token: string

  private constructor({ userId, token }: JWTData) {
    this.userId = userId
    this.token = token
  }

  static decodeToken(
    token: string
  ): Either<InvalidJWTTokenError, JWTTokenPayload> {
    try {
      const decoded = verify(token, auth.secretKey) as JWTTokenPayload

      return right(decoded)
    } catch {
      return left(new InvalidJWTTokenError())
    }
  }

  static signUser(user: User): JWT {
    const token = sign({}, auth.secretKey, {
      subject: user.id,
      expiresIn: auth.expiresIn,
    })

    const jwt = new JWT({ userId: user.id, token })

    return jwt
  }

  static createFromJWT(token: string): Either<InvalidJWTTokenError, JWT> {
    const jwtOrError = JWT.decodeToken(token)

    if (jwtOrError.isLeft()) {
      return left(jwtOrError.value)
    }

    const jwt = new JWT({ userId: jwtOrError.value.sub, token })

    return right(jwt)
  }
}
