/* eslint-disable camelcase */
const BaseModel = require('../BaseModel')

class UserSettings extends BaseModel {
  constructor (...args) {
    super()
    args.forEach(() => {
      console.log(args)
    })
  }
}

module.exports = UserSettings
