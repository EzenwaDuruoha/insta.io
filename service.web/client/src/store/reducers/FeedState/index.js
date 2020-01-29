import {
  LOAD_FEED_FAILURE,
  LOAD_FEED_REQUEST,
  LOAD_FEED_SUCCESS
} from '../../../constants'

export default function createReducer(defaults = {}) {

  const initialState = {
    feed: [],
    ...defaults
  }
  return function (state = initialState, action) {
    switch (action.type) {
      case LOAD_FEED_REQUEST:
      case LOAD_FEED_FAILURE:
      case LOAD_FEED_SUCCESS:
        return { ...state, ...action.payload }
      default:
        return state
    }
  }
}
