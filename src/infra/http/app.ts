import cors from 'cors'
import { config } from 'dotenv-flow'
import express from 'express'
import type { Express } from 'express'
import swaggerUI from 'swagger-ui-express'

import swagger from '../../swagger.json'
import { router } from './routes'

const NODE_ENV = process.env.NODE_ENV || 'development'

export class App {
  private readonly app: Express = express()

  public get server() {
    return this.app
  }

  constructor() {
    config({ node_env: NODE_ENV, silent: true })

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
        origin: NODE_ENV === 'test' ? '*' : 'http://localhost:3000',
      })
    )
  }

  private routes() {
    this.app.use(router)
    this.app.use('/docs', swaggerUI.serve, swaggerUI.setup(swagger))
  }

  public listen(port: number = 3000) {
    const PORT = process.env.PORT || port

    this.app.listen(PORT, () => {
      console.log(`🚀 Server started on port ${PORT}`)
    })
  }
}
