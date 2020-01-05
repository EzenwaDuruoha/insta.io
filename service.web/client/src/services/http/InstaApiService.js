import BaseHttpService from './BaseHttpService'

export default class InstaApiService extends BaseHttpService {
    get auth () {
        return {
            login: (data = {}) => this.post('/auth/api/v1/auth/login', data),
            register: (data = {}) => this.post('/auth/api/v1/auth/register', data)
        }
    }
}