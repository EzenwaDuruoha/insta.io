const {check, oneOf} = require('express-validator')
const uuidValidator = require('uuid-validate')

const validateArray = (value) => {
  if (!Array.isArray(value)) return false
  const err = value.reduce((r, l) => {
    if (typeof l !== 'string' || l.length < 2) {
      r.push(false)
    }
    return r
  }, [])
  return err.length === 0
}

const keys = ['userId', 'tags', 'title']
const validation = {
  userId: (val) => uuidValidator(val, 4),
  tags: validateArray,
  title: (val) => ((typeof val === 'string') && (val.trim()))
}

const nestedSanitizer = (value) => {
  if (!value) return undefined
  if (typeof value !== 'object') return {}
  return value
}

const nestedValidator = (value) => {
  if (!value) return false
  const fields = Object.keys(value)
  if (!fields.length) return false
  const err = fields.reduce((reducer, key) => {
    if (!keys.includes(key) || !validation[key]) reducer.push(false)
    const isValid = validation[key](value[key])
    !isValid && reducer.push(false)
    return reducer
  }, [])
  return err.length === 0
}

module.exports = [
  oneOf([
    check('id')
      .isUUID('4'),
    check('and')
      .customSanitizer(nestedSanitizer)
      .custom(nestedValidator),
    check('or')
      .customSanitizer(nestedSanitizer)
      .custom(nestedValidator)
  ])
]
