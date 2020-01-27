import BaseHttpService from './BaseHttpService'

export default class UserService extends BaseHttpService {
  get auth() {
    return {
      login: (data = {}) => this.post('/api/v1/auth/login', data),
      register: (data = {}) => this.post('/api/v1/auth/register', data)
    }
  }
}
