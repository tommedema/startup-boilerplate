import React, { Fragment, EventHandler, SyntheticEvent } from 'react'
import { useAuth0 } from '../lib/auth0'

const LoginView: React.FC = () => {
  const { loginWithRedirect, loginWithPopup } = useAuth0()

  const onLoginClick: EventHandler<SyntheticEvent<HTMLAnchorElement>> = async (e) => {
    e.preventDefault()
    // await loginWithRedirect()
    await loginWithPopup()
  }

  return (
    <Fragment>
      <p>What's your inner animal?</p>
      <a href="" onClick={onLoginClick}>
        Login to view Emoji
      </a>
    </Fragment>
  )
}

export default LoginView