import { config as dotenvConfig } from 'dotenv-flow'
dotenvConfig({ silent: true })

export const config = {
  googleClientId: process.env.GOOGLE_CLIENT_ID,
}
