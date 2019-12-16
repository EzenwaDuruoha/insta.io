const {check} = require('express-validator')

module.exports = [
  check('firstname')
    .optional()
    .trim()
    .not()
    .isEmpty()
    .isLength({min: 2}),
  check('lastname')
    .optional()
    .trim()
    .not()
    .isEmpty()
    .isLength({min: 2}),
  check('mobile')
    .optional()
    .isInt()
    .isLength({min: 5})
    .toInt(),
  check('birthday')
    .optional()
    .isISO8601()
    .toDate(),
  check('gender')
    .optional()
    .isIn(['M', 'F']),
  check('street')
    .optional()
    .trim()
    .not()
    .isEmpty()
    .isLength({min: 2}),
  check('city')
    .optional()
    .trim()
    .not()
    .isEmpty()
    .isLength({min: 2}),
  check('state')
    .optional()
    .trim()
    .not()
    .isEmpty()
    .isLength({min: 2}),
  check('postcode')
    .optional()
    .trim()
    .not()
    .isEmpty()
    .isLength({min: 2}),
  check('country')
    .optional()
    .trim()
    .not()
    .isEmpty()
    .isLength({min: 2}),
  check('timezone')
    .optional()
    .trim()
    .not()
    .isEmpty()
    .isLength({min: 2})
]
