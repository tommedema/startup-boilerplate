import React, { Fragment } from 'react'
import { useAuth0 } from '../lib/auth0'

const LoginView: React.FC = () => {
  const { loginWithRedirect } = useAuth0()

  return (
    <Fragment>
      <p>What's your inner animal?</p>
      <a href="" onClick={loginWithRedirect}>
        Login to view Emoji
      </a>
    </Fragment>
  )
}

export default LoginView