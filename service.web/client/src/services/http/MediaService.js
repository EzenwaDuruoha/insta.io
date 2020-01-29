import BaseHttpService from './BaseHttpService'

export default class MediaService extends BaseHttpService {
  get feed() {
    return {
      get: (token) => this.get('/api/v1/feed', {
        headers: {
          Authorization: token
        }
      })
    }
  }
}
