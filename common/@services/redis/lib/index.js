const Redis = require('ioredis')
const EventEmitter = require('events')

class RedisService extends EventEmitter {
  constructor () {
    super()
    this._client = null
  }

  get client () {
    if (!this._client) throw new Error('Client not Initialized')
    return this._client
  }

  init (config, isCluster, options = {}) {
    let temp
    if (isCluster) {
      temp = new Redis.Cluster(config, {lazyConnect: true, redisOptions: options})
    } else {
      temp = new Redis({...config, ...options, lazyConnect: true})
    }
    temp.on('connecting', () => this.emit('connecting', config))
    temp.on('error', (err) => this.emit('error', err))

    return new Promise((resolve, reject) => {
      temp.on('ready', () => {
        this._client = temp
        this.emit('connected')
        resolve(true)
      })
      temp.connect()
        .catch((err) => reject(err))
    })
  }

  /**
     *
     * @param {Function} fn
     */
  handle (fn) {
    return async (...args) => {
      const response = {
        error: null,
        data: null
      }

      try {
        if (this._client) {
          response.data = await fn(...args)
        } else {
          response.error = new Error('Client not Initialized')
        }
      } catch (error) {
        response.error = error
      }
      return response
    }
  }

  set (...args) {
    return this.handle((...args) => this._client.set(...args))(...args)
  }

  get (...args) {
    return this.handle((...args) => this._client.get(...args))(...args)
  }

  ttl (...args) {
    return this.handle((...args) => this._client.ttl(...args))(...args)
  }
}

module.exports = RedisService
