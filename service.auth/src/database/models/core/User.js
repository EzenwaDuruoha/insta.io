/* eslint-disable camelcase */
const bcrypt = require('bcryptjs')
const BaseModel = require('../BaseModel')

class User extends BaseModel {
  constructor (id, username, password, email, confirmed, confirmed_on, last_access, deleted, created_at) {
    super()
    this.id = id
    this.username = username
    this.password = password
    this.email = email
    this.confirmed = confirmed
    this.confirmed_on = confirmed_on
    this.last_access = last_access
    this.deleted = deleted
    this.created_at = created_at
  }

  async hashPassword (password) {
    const saltRounds = 10
    this.password = await bcrypt.hash(password, saltRounds)
  }

  validatePassword (rawPassword) {
    return bcrypt.compareSync(rawPassword, this.password)
  }
}

module.exports = User
