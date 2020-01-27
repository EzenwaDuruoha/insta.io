import React, { Suspense } from 'react'
import { AnimatedSwitch as Switch } from 'react-router-transition'
import Loader from '../../components/Loader'
import ErrorHandler from '../../components/Common/ErrorHandler'
import { buildRoutes } from '../../util/system/routing'
import './main.scss'
import './app.scss'

function App(props) {
  const { routes, location } = props
  return (
    <div className='App'>
      <ErrorHandler>
        <Suspense fallback={<Loader />}>
          <div className='main'>
            <Switch atEnter={{ opacity: 0 }}
              atLeave={{ opacity: 0 }}
              atActive={{ opacity: 1 }}
              className="switch-wrapper"
              location={location}>
              {buildRoutes(routes)}
            </Switch>
          </div>
        </Suspense>
      </ErrorHandler>
    </div>
  )
}

export default App;
