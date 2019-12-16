const {check, oneOf} = require('express-validator')

module.exports = [
  oneOf([
    check('username')
      .trim()
      .not()
      .isEmpty()
      .isLength({min: 2}),
    check('email')
      .trim()
      .isEmail(),
  ]),
  check('password')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)
]
