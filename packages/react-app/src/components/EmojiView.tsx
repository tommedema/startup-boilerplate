import React, { Fragment } from 'react'
import stringToEmoji from '@org/string-to-emoji'
import { useAuth0 } from '../lib/auth0'

const EmojiView: React.FC = () => {
  // ToDo: get email from Auth0 user profile
  const emoji = stringToEmoji('example@domain.tld')
  const {
    isAuthenticated,
    logout
  } = useAuth0()

  if (!isAuthenticated) {
    return <div>Permission Denied</div>
  }

  return (
    <Fragment>
      <p>Your inner animal is:</p>
      <h2>{ emoji }</h2>
      <a href="" onClick={() => logout()}>Logout</a>
    </Fragment>
  )
}

export default EmojiView