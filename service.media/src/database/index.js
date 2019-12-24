const mongoose = require('mongoose')
const logger = require('@utils/logger').getLogger({service: 'Media.Service'})
const config = require('../../config')

class DatabaseService {
  constructor (config) {
    mongoose.Promise = global.Promise
    mongoose.set('bufferCommands', false)
    this._client = null
  }

  get client () {
    if (!this._client) throw new Error('Client not intialized')
    return this._client
  }

  async init (options = {}) {
    const opts = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      autoIndex: config.isDev(), // Don't build indexes
      useUnifiedTopology: true,
      poolSize: 10, // Maintain up to 10 socket connections
      keepAliveInitialDelay: 300000,
      ssl: true, // config.isProd(),
      // If not connected, return errors immediately rather than waiting for reconnect
      bufferMaxEntries: 0,
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      ...options
    }
    this._client = await mongoose.connect(config.db, opts)
    require('./models')
    logger.info('Media.Service Database Initialization Successful', {opts, tag: 'database_service'})
    return true
  }

  async close () {
    try {
      await mongoose.disconnect()
    } catch (error) {
      logger.error(error, {tag: 'database_service'})
    }
  }
}

module.exports = DatabaseService
