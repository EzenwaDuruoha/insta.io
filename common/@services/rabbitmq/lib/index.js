const EventEmitter = require('events')
const amqp = require('amqplib')
const uuid = require('uuid/v4')

class MQService extends EventEmitter {
  constructor (config = {}, logger = null, loggerOptions = {}) {
    super()
    this.config = config
    this.connector = null
    this.channel = null
    this.logger = logger || {
      info: () => {},
      error: () => {}
    }
    this.loggerOptions = loggerOptions
  }

  async init (initalCreate = false) {
    const {options, queueName, queueOptions, exechangeName} = this.config
    this.connector = await amqp.connect(options)
    this.channel = await this.connector.createChannel()

    if (initalCreate) {
      await this.channel.assertQueue(queueName, queueOptions)
      await this.channel.assertExchange(exechangeName, 'fanout', queueOptions)
    }
    const receiver = this.receiver.bind(this)
    await this.channel.bindQueue(queueName, exechangeName, '')
    await this.channel.prefetch(1)
    await this.channel.consume(queueName, receiver, {noAck: false})
    return true
  }

  publish (message, exchange, options = {}) {
    if (!this.connector) return false
    const defaults = {headers: {}, contentType: null, persist: true, ...options}

    try {
      let parsed = ''
      const publishOptions = {
        contentType: defaults.contentType || 'text/plain',
        contentEncoding: 'utf8',
        timestamp: Date.now(),
        persistent: defaults.persist,
        headers: {
          publisher: 'agg-auth',
          ...defaults.headers
        }
      }
      if (typeof message === 'object') {
        parsed = JSON.stringify(message)
        if (!defaults.contentType) {
          publishOptions.contentType = 'application/json'
        }
      } else {
        parsed += message
      }
      const completed = this.channel.publish(exchange, '', Buffer.from(parsed, 'utf8'), publishOptions)
      this.logger.info('Published Message', {completed, parsed, headers: defaults.headers, at: (new Date()).toUTCString(), ...this.loggerOptions})
      this.emit('published', {completed, parsed, publishOptions, at: (new Date()).toUTCString()})
    } catch (error) {
      this.emit('error', error)
      this.logger.error(error, {...this.loggerOptions})
    }
  }

  receiver (message) {
    const mid = uuid()
    const at = new Date()
    this.logger.info('MQ Message Recieved', {at: at.toISOString(), mid, meta: message.properties, ...this.loggerOptions})
    if (this.channel) {
      this.channel.ack(message)
    }
    const {properties: {headers, contentType = 'plain/text'}, content} = message
    let parsed = {}
    if (content) {
      parsed = content.toString()
      if (contentType.trim().toLowerCase() === 'application/json') {
        try {
          parsed = JSON.parse(parsed)
        } catch (error) {
          parsed = null
          this.emit('error', error)
          this.logger.error(error, {...this.loggerOptions})
        }
      }
      if (parsed) {
        this.emit('message', {consumeTime: at.toISOString(), payload: parsed, headers, buffer: content, mid})
      }
    }
    this.logger.info('MQ Message Data', {headers: headers, content: parsed, mid, ...this.loggerOptions})
  }

  close () {
    if (this.channel) {
      this.channel.close()
    }
    if (this.connector) {
      this.connector.close()
    }
    this.channel = null
    this.connector = null
    this.emit('close')
    this.logger.info('Closing MQ Connection')
  }
}

module.exports = MQService
