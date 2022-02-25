import { Avatar } from './avatar'

describe('User avatar value object', () => {
  it('should accept valid avatar url', () => {
    const avatar1 = Avatar.create('https://johndoe.com/johndoe.png')
    const avatar2 = Avatar.create('https://johndoe.com/johndoe.gif')
    const avatar3 = Avatar.create('https://johndoe.com/johndoe.jpeg')
    const avatar4 = Avatar.create('https://johndoe.com/johndoe.jpg')

    expect(avatar1.isRight()).toBe(true)
    expect(avatar2.isRight()).toBe(true)
    expect(avatar3.isRight()).toBe(true)
    expect(avatar4.isRight()).toBe(true)
  })

  it('Should accept null avatar url', () => {
    const avatar = Avatar.create(null)

    expect(avatar.isRight()).toBe(true)
  })

  it('should reject invalid avatar url when file extension is not png, gif, jpeg or jpg', () => {
    const avatar = Avatar.create('https://johndoe.com/johndoe.pngx')

    expect(avatar.isLeft()).toBe(true)
  })

  it('Should reject invalid avatar url with more than 255 characters', () => {
    const domain = 'a'.repeat(256)

    const avatar = Avatar.create(`https://${domain}.com/johndoe.png`)

    expect(avatar.isLeft()).toBe(true)
  })
})
