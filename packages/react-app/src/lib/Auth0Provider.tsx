import React, { useState, useEffect, useContext, ReactChild } from 'react'
import createAuth0Client from '@auth0/auth0-spa-js'
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client'

interface Auth0ProviderArguments extends Auth0ClientOptions {
  children: ReactChild
  onRedirectCallback: (appState?: any) => void 
}

export const Auth0Context = React.createContext({})
export const useAuth0 = () => useContext(Auth0Context)

/**
 * @see https://github.com/auth0/auth0-spa-js
 * @see https://auth0.com/docs/quickstart/spa/react
 */
export const Auth0Provider = <U extends {}>({
  children,
  onRedirectCallback,
  ...initOptions
}: Auth0ProviderArguments) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<U>()
  const [auth0Client, setAuth0] = useState<Auth0Client>()
  const [loading, setLoading] = useState(true)
  const [popupOpen, setPopupOpen] = useState(false)

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions)
      setAuth0(auth0FromHook)

      if (window.location.search.includes('code=')) {
        const { appState } = await auth0FromHook.handleRedirectCallback()
        onRedirectCallback(appState)
      }

      const authed = await auth0FromHook.isAuthenticated()

      setIsAuthenticated(authed)

      if (authed) {
        const userProfile = await auth0FromHook.getUser()

        setUser(userProfile)
      }

      setLoading(false)
    }
    
    initAuth0()
  }, [])

  const loginWithPopup = async (params = {}) => {
    if (auth0Client === undefined) {
      throw new Error('Auth0 has not been initialized')
    }

    setPopupOpen(true)

    try {
      await auth0Client.loginWithPopup(params)
    } catch (error) {
      console.error(error)
    } finally {
      setPopupOpen(false)
    }

    const userProfile = await auth0Client.getUser()
    setUser(userProfile)

    setIsAuthenticated(true)
  }

  const handleRedirectCallback = async () => {
    if (auth0Client === undefined) {
      throw new Error('Auth0 has not been initialized')
    }

    setLoading(true)
    await auth0Client.handleRedirectCallback()
    const userProfile = await auth0Client.getUser()
    setLoading(false)
    setIsAuthenticated(true)
    setUser(userProfile)
  }

  const getIdTokenClaims = (options?: getIdTokenClaimsOptions) => {
    if (auth0Client === undefined) {
      throw new Error('Auth0 has not been initialized')
    }

    auth0Client.getIdTokenClaims(options)
  }

  const loginWithRedirect = (options?: RedirectLoginOptions) => {
    if (auth0Client === undefined) {
      throw new Error('Auth0 has not been initialized')
    }

    auth0Client.loginWithRedirect(options)
  }

  const getTokenSilently = (options?: GetTokenSilentlyOptions) => {
    if (auth0Client === undefined) {
      throw new Error('Auth0 has not been initialized')
    }

    auth0Client.getTokenSilently(options)
  }

  const getTokenWithPopup = (options?: GetTokenWithPopupOptions) => {
    if (auth0Client === undefined) {
      throw new Error('Auth0 has not been initialized')
    }

    auth0Client.getTokenWithPopup(options)
  }

  const logout = (options?: LogoutOptions) => {
    if (auth0Client === undefined) {
      throw new Error('Auth0 has not been initialized')
    }

    auth0Client.logout(options)
  }

  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims,
        loginWithRedirect,
        getTokenSilently,
        getTokenWithPopup,
        logout
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};