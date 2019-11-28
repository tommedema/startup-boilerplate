import React from 'react'
import ReactDOM from 'react-dom'
import App from './containers/App'
import { Auth0Provider } from './lib/Auth0Provider'

// FIXME: move this to .env or netlify env
const config = {
  domain: '',
  clientId: ''
}

const onRedirectCallback = (appState: any) => {
  const target = appState && appState.targetUrl
    ? appState.targetUrl
    : window.location.pathname
    
  window.history.replaceState({}, document.title, target)
}

ReactDOM.render(
  (
    <Auth0Provider
      domain={config.domain}
      client_id={config.clientId}
      redirect_uri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      <App />
    </Auth0Provider>
  ),
  document.getElementById('root')
)