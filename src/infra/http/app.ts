import cors from 'cors'
import { config } from 'dotenv-flow'
import express from 'express'
import type { Express } from 'express'

import { router } from './routes'

export class App {
  private readonly app: Express = express()

  public get server() {
    return this.app
  }

  constructor() {
    config({ silent: true })

    this.middlewares()
    this.cors()
    this.routes()
  }

  private middlewares() {
    this.app.use(express.json())
  }

  private cors() {
    this.app.use(
      cors({
        exposedHeaders: ['x-total-count', 'Content-Type', 'Content-Length'],
      })
    )
  }

  private routes() {
    this.app.use(router)
  }

  public listen(port: number = 3000) {
    const PORT = process.env.PORT || port

    this.app.listen(PORT, () => {
      console.log(`🚀 Server started on port ${PORT}`)
    })
  }
}
