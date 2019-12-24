const AWS = require('aws-sdk')
const http = require('http')
const logger = require('@utils/logger').getLogger({service: 'Media.Service'})
const {aws} = require('../../../config')

class S3Service {
  constructor (config) {
    const defaults = {
      logger,
      httpOptions: {
        agent: new http.Agent({
          keepAlive: true
        })
      },
      ...aws,
      ...config
    }
    this.client = new AWS.S3(defaults)
  }
}

module.exports = S3Service
