import Joi from '@hapi/joi'
console.log('JOI', Joi)
const loginSchema = Joi.object({
  password: Joi.string()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})')),
  username: [
    Joi.string()
      .min(2),
    Joi.string()
      .email({tlds: false})
  ]
})
.with('username', 'password')

export function loginValidator(params = {}) {
  return loginSchema.validate(params)
}
