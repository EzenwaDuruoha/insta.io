import {
  LOAD_AUTH_FAILURE,
  LOAD_AUTH_REQUEST,
  LOAD_AUTH_SUCCESS,
  LOAD_LOGOUT,
  REDUCER_DEFAULTS
} from '../../../constants'

export function authenticate (req = {}, action='login') {
  return async (dispatch, getState, { userService }) => {
    dispatch({ type: LOAD_AUTH_REQUEST, payload: { isLoading: true } })
    let response = null
    switch (action) {
      case 'login':
        let {res} = await userService.auth.login(req)
        response = res
        break
      case 'register':
        let {res: reg} = await userService.auth.register(req)
        response = reg
        break
      default:
        response = {status: 'error', data: 'Invalid Authentication Operation'}
    }
    const {status, data} = response

    if (status === 'success' && data.token) {
      return dispatch({
        type: LOAD_AUTH_SUCCESS,
        payload: {
          user: data.user,
          profile: data.user.profile,
          settings: data.user.settings,
          loggedIn: true,
          isLoading: false,
          lastFetched: Date.now(),
          errorData: null,
          error: false,
          token: data.token,
        }
      })
    }

    return dispatch({
      type: LOAD_AUTH_FAILURE, payload: {
        isLoading: false,
        errorData: data,
        token: null,
        error: true
      }
    })
  }
}

export function logout (dispatch) {
  return dispatch({
    type: LOAD_LOGOUT,
    payload: {
      user: null,
      profile: null,
      settings: null,
      token: null,
      loggedIn: false,
      ...REDUCER_DEFAULTS
    }
  })
}
