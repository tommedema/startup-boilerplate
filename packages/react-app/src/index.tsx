import React from 'react'
import ReactDOM from 'react-dom'
import App from './containers/App'
import { Auth0Provider } from './lib/Auth0Provider'
import history from './lib/history'

// FIXME: move this to .env or netlify env
const config = {
  domain: 'dev-startup-boilerplate.auth0.com',
  clientId: 'YZQ2d98L8Un34aBxEANq2wzynERPgm6V'
}

const onRedirectCallback = (appState: any) => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  )
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