const {check} = require('express-validator')

module.exports = [
  check('username')
    .trim()
    .not()
    .isEmpty()
    .isLength({min: 2}),
  check('email')
    .trim()
    .isEmail(),
  check('password')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
]
