import React from 'react'
import stringToEmoji from '@org/string-to-emoji'
import { useAuth0 } from '../lib/Auth0Provider'

const App: React.FC = () => {
  const emoji = stringToEmoji('example@domain.tld')
  const {
    isInitializing,
    isAuthenticated,
    loginWithRedirect,
    logout
  } = useAuth0()

  if (isInitializing) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>My React App { emoji }</h1>
      {
        isAuthenticated
        ? <a href="" onClick={() => logout({ federated: true })}>Logout</a>
        : <a href="" onClick={() => loginWithRedirect()}>Login</a>
      }
    </div>
  )
}

export default App