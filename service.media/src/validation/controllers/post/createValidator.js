const {check} = require('express-validator')
const {ALLOWED_MEDIA_CONTENT_TYPES} = require('../../../constants')

const validateArray = (value) => {
  if (!Array.isArray(value)) return false
  const err = value.reduce((r, l) => {
    l = l.trim()
    if (typeof l !== 'string' || l.length < 2) {
      r.push(false)
    }
    return r
  }, [])
  return err.length === 0
}

const lat = /^\(?[+-]?(90(\.0+)?|[1-8]?\d(\.\d+)?)$/
const long = /^\s?[+-]?(180(\.0+)?|1[0-7]\d(\.\d+)?|\d{1,2}(\.\d+)?)\)?$/

module.exports = [
  check('tags')
    .optional()
    .toArray()
    .customSanitizer((value) => {
      return value.map((v) => `${v}`.trim())
    })
    .custom(validateArray),
  check('contentType')
    .trim()
    .isString()
    .custom((value) => {
      return ALLOWED_MEDIA_CONTENT_TYPES.includes(value)
    }),
  check('description')
    .optional()
    .isString(),
  check('location')
    .optional()
    .custom((value) => {
      if (typeof value !== 'object') return false
      if (!value.longitude || !value.latitude) return false
      return lat.test(value.latitude) && long.test(value.longitude)
    }),
  check('title')
    .optional()
    .trim()
    .isString(),
  check('meta')
    .custom((value) => (typeof value === 'object'))
]
