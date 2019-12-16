/* eslint-disable camelcase */
class User {
  constructor (id, username, password, email, confirmed, confirmed_on, last_access, deleted, created_at) {
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
}

module.exports = User
