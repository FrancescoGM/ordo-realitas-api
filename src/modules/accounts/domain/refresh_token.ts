import { Entity } from '@core/domain/Entity'
import { Either, right } from '@core/logic/Either'
import { User } from '@modules/accounts/domain/user'
import { User as PrismaUser } from '@prisma/client'

import { Token } from './token'

interface IRefreshToken {
  token: Token
  user_id: User['id']
  expires_at: Date

  user?: PrismaUser
}

export class RefreshToken extends Entity<IRefreshToken> {
  get token(): Token {
    return this.props.token
  }

  get user_id(): User['id'] {
    return this.props.user_id
  }

  get expires_at(): Date {
    return this.props.expires_at
  }

  public isExpired(): boolean {
    if (this.props.expires_at.getTime() < Date.now()) {
      return true
    }

    return false
  }

  private constructor(props: IRefreshToken, id?: string) {
    super(props, id)
  }

  static create(
    props: IRefreshToken,
    id?: string
  ): Either<Error, RefreshToken> {
    return right(new RefreshToken(props, id))
  }
}
