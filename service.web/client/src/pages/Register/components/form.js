import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Form, Field } from 'react-final-form'
import { FORM_ERROR } from 'final-form'
import Input from '../../../components/Input'
import { authenticate } from '../../../store/reducers/AuthState/actions'
import { LOAD_AUTH_FAILURE } from '../../../constants'
import { registerValidator } from '../../../helpers/schemas'

const _validate = (values = {}) => {
  const errors = {}
  const fields = ['password', 'username', 'email']
  const results = registerValidator(values)
  const { error } = results
  fields.forEach((f) => {
    if (!values[f]) {
      errors[f] = 'Invalid Value'
    }
    if (error && error.details[0].path.includes(f)) {
      errors[f] = 'Invalid Value'
    }
  })
  return errors
}

export default function RegisterForm(props) {
  const dispatch = useDispatch()
  const _submit = useCallback(async (req) => {
    const res = await dispatch(authenticate(req, 'register'))
    const { type, payload } = res
    if (type === LOAD_AUTH_FAILURE) {
      const err = { [FORM_ERROR]: 'An Error Occurred, try again' }
      if (!Array.isArray(payload.errorData)) {
        err[FORM_ERROR] = payload.errorData
        return err
      }
      let msg = []
      for (const error of payload.errorData) {
        let key = (error.param === 'error') ? 'username' : error.param
        msg.push((<span key={key}>{key}: {error.msg}</span>))
      }
      err[FORM_ERROR] = msg
      return err
    }
  }, [dispatch])

  return (
    <Form
      onSubmit={_submit}
      validate={_validate}
      subscription={{ submitting: true, pristine: true, submitError: true, invalid: true }}
      render={(formProps) => {
        const { handleSubmit, pristine, invalid, submitting, submitError } = formProps
        return (
          <form className='register-form' onSubmit={handleSubmit}>
            <div className='br'></div>
            <div className='field'>
              <Field name="username" render={({ input, meta }) => <Input
                placeholder='Username'
                showLabel={false}
                input={input}
                type='text'
                meta={meta} />}
              />
            </div>
            <div className='field'>
              <Field name="email" render={({ input, meta }) => <Input
                placeholder='Email'
                showLabel={false}
                input={input}
                type='email'
                meta={meta} />}
              />
            </div>
            <div className='field'>
              <Field name="password" render={({ input, meta }) => <Input
                placeholder='Password'
                showLabel={false}
                input={input}
                type='password'
                meta={meta} />}
              />
            </div>
            <div className='submit-btn'>
              <button type="submit" disabled={pristine || submitting || (invalid && !submitError)}>
                Next
              </button>
            </div>
            {submitError && <div className='form-error'>
              <p>{submitError}</p>
            </div>}
          </form>
        )
      }} />
  )
}
