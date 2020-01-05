import React from 'react'
import { Route } from 'react-router-dom'
import Gateway from '../../components/Gateway/Gateway'

export function buildRoutes(routes, kwargs) {
  return routes.map((route, i) => {
    const { path, exact, component: Component, ...childProps } = route
    return (
      <Route
        path={path}
        exact={exact || false}
        key={i}
        render={(props) => <Gateway
          route={route}
          render={(args) => <Component {...childProps} {...props} {...args} {...kwargs} />}
        />}
      />
    )
  })
}