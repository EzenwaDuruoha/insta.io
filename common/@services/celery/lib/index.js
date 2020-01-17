'use strict'
const celery = require('node-celery')

class CeleryClient {
  constructor (config = {}) {
    this.client = null
    this.config = config
  }

  init (options = {}) {
    console.log(Object.assign(this.config, options))
    return new Promise((resolve, reject) => {
      this.client = celery.createClient(Object.assign(this.config, options))
      this.client.on('connect', resolve)
      this.client.on('error', reject)
    })
  }

  call (...args) {
    if (!this.client) throw new Error('Client Not Initialized')
    this.client.call(...args)
  }

  registerTasks ({name, fn}) {
    if (!name || !fn || typeof fn !== 'function') throw new Error('Invalid Config')
    if (typeof name === 'string') {
      name = JSON.stringify(name)
    }
    Object.defineProperty(this, name, {
      value: (...args) => {
        return fn(this, ...args)
      },
      writable: false
    })
  }

  close () {
    if (this.client) {
      this.client.end()
      this.client = null
    }
  }
}

module.exports = CeleryClient
