import axios from 'axios'

import { Either, left, right } from '@core/logic/Either'

import { GoogleRequestError } from '../errors/GoogleRequestError'
import { InvalidIdTokenError } from '../errors/InvalidIdTokenError'
import { UnverifiedGoogleEmailError } from '../errors/UnverifiedGoogleEmailError'
import { IGoogleProvider, IGoogleUser } from '../models/IGoogleProvider'

type IGetUserResponse = Either<
  InvalidIdTokenError | GoogleRequestError | UnverifiedGoogleEmailError,
  IGoogleUser
>

export interface IGoogleResponse {
  data: IGoogleUser
}

export class GoogleProvider implements IGoogleProvider {
  constructor() {}

  public validateIdToken(id_token: string): boolean {
    if (!id_token) return false

    if (typeof id_token !== 'string' || id_token.trim().length < 2) return false

    return true
  }

  public validateGoogleResponse(google: IGoogleResponse): boolean {
    const { email_verified } = google.data

    if (email_verified === 'true') return true
    else if (email_verified === 'false') return false

    return false
  }

  async getUser(id_token: string): Promise<IGetUserResponse> {
    if (!this.validateIdToken(id_token)) {
      return left(new InvalidIdTokenError(id_token))
    }

    try {
      const google: IGoogleResponse = await axios.get(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`
      )

      if (!this.validateGoogleResponse(google)) {
        return left(new UnverifiedGoogleEmailError(google.data.email))
      }

      return right(google.data)
    } catch (err) {
      return left(new GoogleRequestError())
    }
  }
}
