import { config } from 'dotenv-flow'
config({ silent: true })

export const auth = {
  secretKey: process.env.SECRET_KEY,
  expiresIn: '7d',
}
