/* eslint-disable camelcase */
const BaseModel = require('../BaseModel')

class UserProfile extends BaseModel {
  constructor (...args) {
    super()
    args.forEach(() => {
      console.log(args)
    })
  }
}

module.exports = UserProfile
