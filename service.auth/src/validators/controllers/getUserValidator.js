const {check, oneOf} = require('express-validator')

module.exports = [
  oneOf([
    check('id')
      .isUUID(),
    check('username')
      .trim()
      .not()
      .isEmpty()
      .isLength({min: 2}),
    check('email')
      .trim()
      .isEmail(),
  ])
]
