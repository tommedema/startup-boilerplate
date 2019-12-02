import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import { Auth0Provider } from './lib/auth0'
import history from './lib/history'

const auth0Domain = process.env.AUTH0_DOMAIN
const auth0ClientId = process.env.AUTH0_CLIENT_ID
const auth0Audience = process.env.AUTH0_AUDIENCE
const auth0RedirectUri = window.location.origin

if (
  auth0Domain === undefined
  || auth0ClientId === undefined
  || auth0Audience === undefined
) {
  throw new Error('missing env vars')
}

const onAuthRedirectCallback = (redirectResult?: RedirectLoginResult) => {
  console.log(
    'auth0 onRedirectCallback called with redirectState %o',
    redirectResult
  )

  // Clears auth0 query string parameters from url
  const targetUrl = redirectResult
    && redirectResult.appState
    && redirectResult.appState.targetUrl
      ? redirectResult.appState.targetUrl
      : window.location.pathname
      
  history.push(targetUrl)
}

ReactDOM.render(
  (
    <Auth0Provider
      domain={auth0Domain}
      client_id={auth0ClientId}
      redirect_uri={auth0RedirectUri}
      audience={auth0Audience}
      onRedirectCallback={onAuthRedirectCallback}
    >
      <App />
    </Auth0Provider>
  ),
  document.getElementById('root')
)