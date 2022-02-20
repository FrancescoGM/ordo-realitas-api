const { exec } = require('child_process')
const NodeEnvironment = require('jest-environment-node')
const { Client } = require('pg')
const util = require('util')
const { v4: uuid } = require('uuid')

require('dotenv-flow').config({ node_env: 'test', silent: true })

const execSync = util.promisify(exec)

const prismaBinary = './node_modules/.bin/prisma'

class PrismaTestEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config)

    const dbUser = process.env.POSTGRES_USER
    const dbPass = process.env.POSTGRES_PASSWORD
    const dbHost = process.env.POSTGRES_HOST
    const dbPort = process.env.POSTGRES_PORT
    const dbName = process.env.POSTGRES_DB

    this.schema = `test_${uuid()}`
    this.connectionString = `postgresql://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?schema=${this.schema}`
  }

  async setup() {
    process.env.DATABASE_URL = this.connectionString
    this.global.process.env.DATABASE_URL = this.connectionString

    await execSync(`${prismaBinary} migrate deploy --preview-feature`)

    return super.setup()
  }

  async teardown() {
    const client = new Client({
      connectionString: this.connectionString,
    })

    await client.connect()
    await client.query(`DROP SCHEMA IF EXISTS "${this.schema}" CASCADE`)
    await client.end()
  }
}

module.exports = PrismaTestEnvironment
