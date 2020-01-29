export const REDUCER_DEFAULTS = {
  isLoading: false,
  lastFetched: null,
  errorData: null,
  error: false
}

// Authenticate (login, register)
export const LOAD_AUTH_REQUEST = 'LOAD_AUTH_REQUEST'
export const LOAD_AUTH_SUCCESS = 'LOAD_AUTH_SUCCESS'
export const LOAD_AUTH_FAILURE = 'LOAD_AUTH_FAILURE'
export const UNSET_LOGIN_TRANSITION = 'UNSET_LOGIN_TRANSITION'

// Log out
export const LOAD_LOGOUT_SUCCESS = 'LOAD_LOGOUT_SUCCESS'
export const LOAD_LOGOUT_FAILURE = 'LOAD_LOGOUT_FAILURE'

// Feed
export const LOAD_FEED_REQUEST = 'LOAD_FEED_REQUEST'
export const LOAD_FEED_SUCCESS = 'LOAD_FEED_SUCCESS'
export const LOAD_FEED_FAILURE = 'LOAD_AUTH_FAILURE'

// logout
export const LOAD_LOGOUT = 'LOAD_LOGOUT'
