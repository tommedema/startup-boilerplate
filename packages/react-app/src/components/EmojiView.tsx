import React, { Fragment } from 'react'
import stringToEmoji from '@org/string-to-emoji'
import { useAuth0, Auth0User } from '../lib/auth0'

const EmojiView: React.FC = () => {
  const {
    isAuthenticated,
    logout,
    user
  } = useAuth0()

  if (!isAuthenticated) {
    return <div>Permission Denied</div>
  }

  const email = user && user.email
  const emoji = stringToEmoji(email || 'default')
  
  return (
    <Fragment>
      <p>Your inner animal is:</p>
      <h2>{ emoji }</h2>
      <p>This is based on a hash of your email {user && user.email}</p>
      <a href="" onClick={() => logout()}>Logout</a>
    </Fragment>
  )
}

export default EmojiView