import { Either } from '@core/logic/Either'

import { GoogleRequestError } from '../errors/GoogleRequestError'
import { InvalidIdTokenError } from '../errors/InvalidIdTokenError'
import { UnverifiedGoogleEmailError } from '../errors/UnverifiedGoogleEmailError'

export interface IGoogleUser {
  email: string
  picture: string
  name: string
  email_verified: 'true' | 'false'
  sub: string
}

type IGetUserResponse = Either<
  InvalidIdTokenError | GoogleRequestError | UnverifiedGoogleEmailError,
  IGoogleUser
>

export interface IGoogleProvider {
  getUser(id_token: string): Promise<IGetUserResponse>
}
