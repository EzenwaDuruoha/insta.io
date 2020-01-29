import appReducer from './AppState'
import authReducer from './AuthState'
import feedReducer from './FeedState'
import {REDUCER_DEFAULTS} from '../../constants'

export default function createReducer(config = {}) {
  return {
    appState: appReducer(config),
    authState: authReducer(REDUCER_DEFAULTS),
    feedState: feedReducer(REDUCER_DEFAULTS)
  }
}
