import {
  LOAD_AUTH_FAILURE,
  LOAD_AUTH_REQUEST,
  LOAD_AUTH_SUCCESS,
  LOAD_LOGOUT
} from '../../../constants'

export default function createReducer(defaults = {}) {

  const initialState = {
    user: null,
    profile: null,
    settings: null,
    token: null,
    loggedIn: false,
    ...defaults
  }
  return function (state = initialState, action) {
    switch (action.type) {
      case LOAD_AUTH_REQUEST:
      case LOAD_AUTH_FAILURE:
      case LOAD_AUTH_SUCCESS:
      case LOAD_LOGOUT:
        return { ...state, ...action.payload }
      default:
        return state
    }
  }
}
