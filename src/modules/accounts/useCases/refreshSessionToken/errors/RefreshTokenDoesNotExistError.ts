import { DomainError } from '@core/domain/errors/DomainError'

export class RefreshTokenDoesNotExistError
  extends Error
  implements DomainError
{
  constructor() {
    super('Refresh token does not exist')
    this.name = 'RefreshTokenDoesNotExistError'
  }
}
