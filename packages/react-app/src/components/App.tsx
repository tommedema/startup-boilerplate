import React from 'react'
import { useAuth0 } from '../lib/auth0'
import EmojiView from './EmojiView'
import LoginView from './LoginView'

const App: React.FC = () => {
  const {
    isInitializing,
    isAuthenticated
  } = useAuth0()

  if (isInitializing) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>My Animal Emoji</h1>
      {
        isAuthenticated
        ? <EmojiView />
        : <LoginView />
      }
    </div>
  )
}

export default App