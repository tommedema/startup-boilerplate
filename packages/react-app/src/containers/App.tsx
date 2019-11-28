import React from 'react'
import stringToEmoji from '../../../string-to-emoji/src'

const App: React.FC = () => {
  const emoji = stringToEmoji('example@domain.tld')

  return (
    <div>
      <h1>My React App { emoji }</h1>
    </div>
  )
}

export default App