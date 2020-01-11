/* eslint-disable no-useless-escape */
const {check} = require('express-validator')

const phoneReg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im

module.exports = [
  check('username')
    .optional()
    .trim()
    .not()
    .isEmpty()
    .bail()
    .isLength({min: 2}),
  check('email')
    .optional()
    .trim()
    .isEmail(),
  check('firstname')
    .optional()
    .trim()
    .not()
    .isEmpty()
    .bail()
    .isLength({min: 2}),
  check('lastname')
    .optional()
    .trim()
    .not()
    .isEmpty()
    .bail()
    .isLength({min: 2}),
  check('mobile')
    .optional()
    .isString()
    .isLength({min: 5})
    .bail()
    .custom((val) => phoneReg.test(val)),
  check('birthday')
    .optional()
    .isISO8601()
    .toDate(),
  check('gender')
    .optional()
    .isIn(['male', 'female', 'other', 'anonymous']),
  check('street')
    .optional()
    .trim()
    .not()
    .isEmpty()
    .bail()
    .isLength({min: 2}),
  check('city')
    .optional()
    .trim()
    .not()
    .isEmpty()
    .bail()
    .isLength({min: 2}),
  check('state')
    .optional()
    .trim()
    .not()
    .isEmpty()
    .bail()
    .isLength({min: 2}),
  check('postcode')
    .optional()
    .trim()
    .not()
    .isEmpty()
    .bail()
    .isLength({min: 2}),
  check('country')
    .optional()
    .trim()
    .not()
    .isEmpty()
    .bail()
    .isLength({min: 2}),
  check('timezone')
    .optional()
    .trim()
    .not()
    .isEmpty()
    .bail()
    .isLength({min: 2})
]
