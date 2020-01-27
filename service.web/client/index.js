import 'normalize.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter, Route } from 'react-router-dom'
import { router } from './src/routes'
import getConfig from './config'
import { configureStore } from './src/store'
import * as serviceWorker from './src/util/serviceWorker'

const initData = window.INITIAL_STATE
const config = getConfig(initData)
const {store, persistor} = configureStore(config)

function Main() {
  const { component: Component, exact, path, ...childProps } = router
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <React.Fragment>
            <Route
              component={(props) => <Component {...props} {...childProps} />}
              exact={exact}
              path={path}
            />
          </React.Fragment>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  )
}

ReactDOM.render(<Main />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
