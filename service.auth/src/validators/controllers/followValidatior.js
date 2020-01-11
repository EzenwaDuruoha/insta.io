const {check} = require('express-validator')

module.exports = [
  check('followed')
    .isUUID(),
  check('action')
    .isIn(['follow', 'unfollow'])
]
