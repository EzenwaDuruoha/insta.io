import React from 'react'
import { Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Gateway(props) {
  const authState = useSelector((store) => store.authState)
  const { loggedIn } = authState
  const { render, route } = props
  if (route.loginRequired && !loggedIn) {
    return <Redirect to='/login' />
  }
  if (route.redirectOnLogin && loggedIn) {
    return <Redirect to='/feed' />
  }
  return render()
}
