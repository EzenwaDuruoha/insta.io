import {
  LOAD_FEED_FAILURE,
  LOAD_FEED_REQUEST,
  LOAD_FEED_SUCCESS
} from '../../../constants'
import {withAuthContext} from '../../../helpers/store'

export function getUserFeed() {
  return async (dispatch, getState, { mediaService }) => {
    const {authState: {token}} = getState()
    dispatch({ type: LOAD_FEED_REQUEST, payload: { isLoading: true } })
    const response = await withAuthContext(mediaService.feed.get.bind(mediaService, token), dispatch)
    const {res: {status, data}} = response
    if (status === 'success') {
      return dispatch({
        type: LOAD_FEED_SUCCESS,
        payload: {
          feed: data,
          isLoading: false,
          lastFetched: Date.now(),
          errorData: null,
          error: false,
        }
      })
    }
    return dispatch({
      type: LOAD_FEED_FAILURE,
      payload: {
        error: true,
        errorData: data,
        isLoading: false,
      }
    })
  }
}
