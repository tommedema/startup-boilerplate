import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import { Auth0Provider, Auth0RedirectState } from './lib/auth0'
import history from './lib/history'

const auth0Domain = process.env.AUTH0_DOMAIN
const auth0ClientId = process.env.AUTH0_CLIENT_ID
const auth0RedirectUri = window.location.origin

if (auth0Domain === undefined || auth0ClientId === undefined) {
  throw new Error('missing env vars')
}

const onAuthRedirectCallback = (redirectState?: Auth0RedirectState) => {
  console.log(
    'auth0 onRedirectCallback called with redirectState %o',
    redirectState
  )

  // Clears auth0 query string parameters from url
  history.push(
    redirectState && redirectState.targetUrl
      ? redirectState.targetUrl
      : window.location.pathname
  )
}

ReactDOM.render(
  (
    <Auth0Provider
      domain={auth0Domain}
      client_id={auth0ClientId}
      redirect_uri={auth0RedirectUri}
      onRedirectCallback={onAuthRedirectCallback}
    >
      <App />
    </Auth0Provider>
  ),
  document.getElementById('root')
)