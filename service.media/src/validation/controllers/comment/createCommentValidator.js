const {check} = require('express-validator')
const {MODEL_ACTIVITY_ACTORS} = require('../../../constants')

module.exports = [
  check('relatedTo')
    .isUUID('4'),
  check('body')
    .trim()
    .isString()
    .isLength({min: 2}),
  check('actor')
    .trim()
    .isString()
    .custom((value) => MODEL_ACTIVITY_ACTORS.includes(value))
]
