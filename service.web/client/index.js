import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from "react-router-dom"
import { router } from './src/routes'
import * as serviceWorker from './src/util/serviceWorker';

function Main() {
    const { component: Component, exact, path, ...childProps } = router
    return (
        <BrowserRouter>
            <React.Fragment>
                <Route
                    component={(props) => <Component {...props} {...childProps} />}
                    exact={exact}
                    path={path}
                />
            </React.Fragment>
        </BrowserRouter>
    )
}

ReactDOM.render(<Main />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
