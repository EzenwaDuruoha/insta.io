import React from 'react'
import App from '../pages/App/App'
import * as paths from './paths'

export const router = {
  path: paths.indexRoute,
  component: App,
  exact: false,
  routes: [
    // Lander Route
    {
      path: paths.indexRoute,
      exact: true,
      loginRequired: false,
      redirectOnLogin: true,
      component: React.lazy(() => import('../pages/Lander/Lander'))
    },
    // Feed Route
    {
      path: paths.feedRoute,
      exact: true,
      loginRequired: true,
      redirectOnLogin: false,
      component: React.lazy(() => import('../pages/Feed/Feed'))
    },
    // Login Route
    {
      path: paths.loginRoute,
      exact: true,
      loginRequired: false,
      redirectOnLogin: true,
      component: React.lazy(() => import('../pages/Login/Login'))
    },
    // Register Route
    {
      path: paths.registerRoute,
      exact: true,
      loginRequired: false,
      redirectOnLogin: true,
      component: React.lazy(() => import('../pages/Register/Register'))
    },
    // Profile route
    {
      path: paths.profileRoute,
      exact: false,
      loginRequired: true,
      redirectOnLogin: false,
      component: React.lazy(() => import('../pages/Profile/Profile')),
    },
    // Explore route
    {
      path: paths.exploreRoute,
      exact: false,
      loginRequired: true,
      redirectOnLogin: false,
      component: React.lazy(() => import('../pages/Explore/Explore')),
    },
    // Account route
    {
      path: paths.accountRoute,
      exact: false,
      loginRequired: true,
      redirectOnLogin: false,
      component: React.lazy(() => import('../pages/Account/Account')),
    },
    // User route
    {
      path: paths.userRoute,
      exact: true,
      loginRequired: true,
      redirectOnLogin: false,
      component: React.lazy(() => import('../pages/User/User')),
    },
    // not-found
    {
      path: paths.notFound,
      exact: false,
      loginRequired: false,
      redirectOnLogin: false,
      component: React.lazy(() => import('../pages/404/index'))
    },
  ]
}
