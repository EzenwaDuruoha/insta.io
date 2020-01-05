import axios from 'axios'

export default class BaseHttpService {
  constructor (serviceUrl) {
    const opts = {
      baseURL: serviceUrl,
      validateStatus: false,
      timeout: 1000,
      headers: {
        'User-Agent': 'Service.Web'
      }
    }
    this.serviceUrl = serviceUrl
    this.request = axios.create(opts)
    this.request.defaults.headers.post['Content-Type'] = 'application/json'
    this.request.defaults.headers.put['Content-Type'] = 'application/json'
  }

  /**
   *
   * @param {Function} fn
   * @returns {Object}
   */
  middleware (fn) {
    let response = {
      status: 'error',
      data: 'An Internal Error Occured'
    }
    return async (...args) => {
      try {
        const res = await fn(...args)
        response = res.data
        console.log('HTTP Response', {args, response: response, serviceUrl: this.serviceUrl})
      } catch (error) {
        console.log(error, {tag: `${this.serviceUrl}_http_service`})
      }
      return response
    }
  }

  /**
   *
   * @param  {...any} args
   */
  async post (...args) {
    return this.middleware(this.request.post)(...args)
  }

  /**
   *
   * @param  {...any} args
   */
  async get (...args) {
    return this.middleware(this.request.get)(...args)
  }

  /**
   *
   * @param  {...any} args
   */
  async put (...args) {
    return this.middleware(this.request.put)(...args)
  }

  /**
   *
   * @param  {...any} args
   */
  async delete (...args) {
    return this.middleware(this.request.delete)(...args)
  }
}
