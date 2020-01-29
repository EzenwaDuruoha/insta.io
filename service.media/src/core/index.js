const RedisService = require('@services/redis')
const MQService = require('@services/rabbitmq')
const JWTService = require('@services/jwt')
const DatabaseService = require('../database')
const WorkerDispatcher = require('../services/HTTP/WorkerDispatcher')
const UserService = require('../services/HTTP/UserService')
const config = require('../../config')
const logger = require('@utils/logger').getLogger({service: 'Media.Service'})

const databaseService = new DatabaseService()
const redisService = new RedisService()
const mqService = new MQService(config.rabbitmq, logger, {tag: 'MQ_SERVICE'})
const jwtService = new JWTService()
const worker = new WorkerDispatcher(config.network.workerService)
const userService = new UserService(config.network.authService)

const services = {
  databaseService,
  jwtService,
  mqService,
  redisService,
  userService,
  worker
}
/**
 * @module Media.Core
 */
module.exports = {
  initialized: false,
  init: async () => {
    return Promise.all([
      databaseService.init(),
      redisService.init(config.redis, config.isRedisCluster),
      mqService.init(config.isDev()),
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
