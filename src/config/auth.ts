import { config } from 'dotenv-flow'
config({ silent: true })

export const auth = {
  secretKey: process.env.SECRET_KEY,
  expiresIn: 60 * 10, // 10 minutes
  refreshTokenExpiresIn: 30, // Thirty days
}
