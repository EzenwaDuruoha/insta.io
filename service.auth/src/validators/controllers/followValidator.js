const {check} = require('express-validator')

module.exports = [
  check('followed')
    .isUUID()
]
