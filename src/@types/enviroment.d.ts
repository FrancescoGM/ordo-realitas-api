/* eslint-disable @typescript-eslint/naming-convention */
declare global {
  export namespace NodeJS {
    export interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      PORT: string

      SECRET_KEY: string

      POSTGRES_USER: string
      POSTGRES_PASSWORD: string
      POSTGRES_DB: string
      POSTGRES_HOST: string
      POSTGRES_PORT: string
    }
  }
}

export {}
