import { Avatar } from './avatar'
import { Email } from './email'
import { Google } from './google'
import { Name } from './name'
import { Password } from './password'
import { User } from './user'

const email = Email.create('johndoe@johndoe.com').value as Email
const name = Name.create('John Doe').value as Name
const password = Password.create('123456').value as Password
const avatar_url = Avatar.create('https://johndoe.com/johndoe.png')
  .value as Avatar
const google_id = Google.create(null).value as Google

describe('User model', () => {
  it('Should accept valid user', () => {
    const user = User.create({
      email,
      name,
      password,
      avatar_url,
      google_id,
    })

    expect(user.isRight()).toBe(true)
  })
})
