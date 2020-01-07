const DatabaseService = require('../database')
const JWTService = require('@services/jwt')
const RedisService = require('@services/redis')
const MQService = require('@services/rabbitmq')
const databaseConfig = require('../database/connection')
const config = require('../../config')
const logger = require('@utils/logger').getLogger({service: 'Media.Service'})

const dbService = new DatabaseService()
const jwtService = new JWTService()
const redisService = new RedisService()
const mqService = new MQService(config.rabbitmq, logger, {tag: 'MQ_SERVICE'})

const services = {
  dbService,
  jwtService,
  redisService,
  mqService
}
/**
 * @module Media.Core
 */
module.exports = {
  initialized: false,
  init: async () => {
    return Promise.all([
      dbService.init(databaseConfig),
      redisService.init(config.redis, config.isRedisCluster),
      mqService.init(config.isDev())
    ])
      .then((results) => {
        this.initialized = true
        return results
      })
      .catch((error) => {
        this.initialized = false
        logger.error(error, {tag: 'CORE_INIT'})
        return false
      })
  },
  getServices: () => {
    return services
  },
  /**
   * @param {Array<Function>} handlers
   */
  setupCloseHandlers: (handlers) => {
    if (Array.isArray(handlers)) {
      Object.keys(services).forEach((key) => {
        const service = services[key]
        if (typeof service.close === 'function') {
          handlers.push(service.close.bind(service))
        }
      })
    }
  }
}
