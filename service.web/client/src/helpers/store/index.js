import {logout} from '../../store/reducers/AuthState/actions'

export async function withAuthContext(fn, dispatch) {
  if (typeof fn === 'function') {
    const response = await fn()
    const {meta} = response
    if (meta.status && meta.status === 403) {
      logout(dispatch)
    }
    return response
  }
  throw new Error('Expected Function')
}
