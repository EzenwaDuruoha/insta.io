import React, { Suspense } from 'react'
import { Switch } from 'react-router-dom'
import Loader from '../../components/Loader'
import ErrorHandler from '../../components/Common/ErrorHandler'
import { buildRoutes } from '../../util/system/routing'

function App(props) {
    const { routes, location } = props
    return (
        <div className="App">
            <ErrorHandler>
                <Suspense fallback={<Loader />}>
                    <div>
                        Hey
                        <Switch location={location}>
                            {buildRoutes(routes)}
                        </Switch>
                    </div>
                </Suspense>
            </ErrorHandler>
        </div>
    );
}

export default App;
