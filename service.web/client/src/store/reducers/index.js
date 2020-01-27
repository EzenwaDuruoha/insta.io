import appReducer from './AppState'
import authReducer from './AuthState'

export default function createReducer(config = {}) {
  return {
    appState: appReducer(config),
    authState: authReducer()
  }
}
