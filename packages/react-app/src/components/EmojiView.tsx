import React, { Fragment, EventHandler, SyntheticEvent } from 'react'
import { useAuth0 } from '../lib/auth0'
import useAPIResult from '../lib/useAPIResult'

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

  if (!email) {
    return <div>Failed to fetch user email from identity service</div>
  }

  const emoji = useAPIResult<{ emoji: string }, string>(
    `emoji/${encodeURIComponent(email)}`,
    body => body.emoji
  )

  const onLogoutClick: EventHandler<SyntheticEvent<HTMLAnchorElement>> = (e) => {
    e.preventDefault()
    logout()
  }
  
  return (
    <Fragment>
      <p>Your inner animal is:</p>
      <h2>{ emoji }</h2>
      <p>This is based on a hash of your email {user && user.email}</p>
      <a href="" onClick={onLogoutClick}>Logout</a>
    </Fragment>
  )
}

export default EmojiView