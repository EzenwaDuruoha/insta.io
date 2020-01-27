import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import createReducers from './reducers'
import UserService from '../services/http/UserService'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['authState']
}


export function configureStore(config) {
  const reducers = combineReducers(createReducers(config))
  const persistedReducer = persistReducer(persistConfig, reducers)
  const reduxDevTool = config.env === 'development' && typeof window === 'object' &&
    typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : f => f
  const store = createStore(persistedReducer, compose(applyMiddleware(thunk.withExtraArgument({
    userService: new UserService(config.userServiceUrl),
  })), reduxDevTool))
  const persistor = persistStore(store)

  return { store, persistor }
}
