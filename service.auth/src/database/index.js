const {createConnection} = require('typeorm')
const logger = require('@utils/logger').getLogger({service: 'Auth.Service'})
const entities = require('./entity')
const models = require('./models')

class DatabaseService {
  constructor () {
    this.client = null
  }

  async init (dbConfig = {}) {
    this.client = await createConnection(dbConfig)
    logger.info('insta_auth Database Initialization Successfull')
    return true
  }

  get manager () {
    if (!this.client) {
      return false
    }
    return this.client.manager
  }

  /**
   *
   * @param {Function} fn
   */
  wrapper (fn) {
    return async (...args) => {
      const res = {
        error: null,
        data: null
      }
      try {
        if (!this.client) {
          res.error = new Error('Database Connection not Initialized')
          logger.error(res.error)
        } else {
          res.data = await fn(...args)
        }
      } catch (error) {
        logger.error(error, {args})
        res.error = error
      }
      return res
    }
  }

  /**
   *
   * @param {EntitySchema} entity
   */
  getRepo (entity) {
    return this.wrapper(async (entity) => {
      return this.client.getRepository(entity)
    })(entity)
  }

  /**
   *
   * @param {String} name
   */
  getRepoByName (name) {
    return this.wrapper(async (name) => {
      if (typeof name !== 'string') {
        throw new Error('Entity Name Should be type String')
      }
      const found = entities[name]
      if (!found) {
        throw new Error('Entity not Found')
      }
      return this.client.getRepository(found)
    })(name)
  }

  /**
   *
   * @param {String} name
   */
  getEntity (name) {
    if (typeof name !== 'string') return false
    return entities[name]
  }

  /**
   *
   * @param {*} name
   */
  getModel (name) {
    if (typeof name !== 'string') return false
    return models[name]
  }
}

module.exports = DatabaseService
