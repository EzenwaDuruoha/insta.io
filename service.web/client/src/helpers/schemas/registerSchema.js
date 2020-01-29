import Joi from '@hapi/joi'

const schema = Joi.object({
  password: Joi.string()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})')),
  username: Joi.string()
    .min(2),
  email: Joi.string()
    .email({ tlds: false })
})

export function registerValidator(params = {}) {
  return schema.validate(params)
}
