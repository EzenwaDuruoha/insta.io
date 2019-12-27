const AWS = require('aws-sdk')
const http = require('http')
const utils = require('util')
const logger = require('@utils/logger').getLogger({service: 'Media.Service'})
const {aws} = require('../../../config')

class S3Service {
  constructor (config = {}) {
    const defaults = {
      logger,
      apiVersion: '2006-03-01',
      httpOptions: {
        agent: new http.Agent({
          keepAlive: true,
          maxSockets: 25
        })
      },
      ...aws,
      ...config
    }
    this.client = new AWS.S3(defaults)
  }

  /**
   *
   * @param {Function} fn
   * @param  {...any} args
   */
  _call (fn, promisify = true, isSync = false) {
    const response = {
      error: null,
      data: null
    }
    return async (...args) => {
      try {
        if (promisify) {
          fn = utils.promisify(fn)
        }
        if (!isSync) {
          response.data = await fn(...args)
        } else {
          response.data = fn(...args)
        }
      } catch (error) {
        response.error = error
        logger.error(error, {tag: 'S3.Service'})
      }
      return response
    }
  }

  /**
   *
   * @param {String} bucket
   * @param {String} key
   */
  uploadToBucket (bucket, key) {
    return this._call(this.client.putObject.bind(this.client))({Bucket: bucket, Key: key})
  }

  /**
   *
   * @param {String} Bucket
   * @param {String} Key
   * @param {Object} args
   * @param {Number} Expires
   */
  generateUploadURL (Bucket, Key, args = {}, Expires = 3600) {
    return this._call(this.client.getSignedUrl.bind(this.client), false)('putObject', {Bucket, Key, Expires, ...args})
  }
}

module.exports = S3Service
