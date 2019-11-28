import React, { useState, useEffect, useContext, ReactChild } from 'react'
import createAuth0Client from '@auth0/auth0-spa-js'
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client'

interface Auth0ProviderArguments extends Auth0ClientOptions {
  children: ReactChild
  onRedirectCallback: (appState?: any) => void 
}

interface Auth0ContextProps<U = {}> {
  user?: U
  isAuthenticated: boolean
  isInitializing: boolean
  isPopupOpen: boolean
  loginWithPopup: (options?: PopupLoginOptions) => Promise<void>,
  loginWithRedirect: (options?: RedirectLoginOptions) => Promise<void>,
  logout: (options?: LogoutOptions) => void
}

const initialContext = {
  user: {},
  isAuthenticated: false,
  isInitializing: true,
  isPopupOpen: false,
  loginWithPopup: async () => {},
  loginWithRedirect: async () => {},
  logout: () => {}
}

export const Auth0Context = React.createContext<Auth0ContextProps>(initialContext)
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
  const [isAuthenticated, setIsAuthenticated] = useState(initialContext.isAuthenticated)
  const [isInitializing, setIsInitializing] = useState(initialContext.isInitializing)
  const [isPopupOpen, setIsPopupOpen] = useState(initialContext.isPopupOpen)
  const [user, setUser] = useState<U>()
  const [auth0Client, setAuth0] = useState<Auth0Client>()

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions)
      setAuth0(auth0FromHook)

      if (window.location.search.includes('code=')) {
        const { appState } = await auth0FromHook.handleRedirectCallback()
        onRedirectCallback(appState)
      }

      const authed = await auth0FromHook.isAuthenticated()

      if (authed) {
        const userProfile = await auth0FromHook.getUser()

        setIsAuthenticated(true)
        setUser(userProfile)
      }

      setIsInitializing(false)
    }
    
    initAuth0()
  }, [])

  const loginWithPopup = async (options?: PopupLoginOptions) => {
    if (auth0Client === undefined) {
      throw new Error('Auth0 has not been initialized')
    }

    console.log('popup is open')
    setIsPopupOpen(true)

    try {
      await auth0Client.loginWithPopup(options)
    } catch (error) {
      console.error(error)
    } finally {
      console.log('popup closed')
      setIsPopupOpen(false)
    }

    const userProfile = await auth0Client.getUser()
    setUser(userProfile)

    setIsAuthenticated(true)
  }

  const handleRedirectCallback = async () => {
    if (auth0Client === undefined) {
      throw new Error('Auth0 has not been initialized')
    }

    setIsInitializing(true)
    await auth0Client.handleRedirectCallback()
    const userProfile = await auth0Client.getUser()
    setIsInitializing(false)
    setIsAuthenticated(true)
    setUser(userProfile)
  }

  const getIdTokenClaims = (options?: getIdTokenClaimsOptions) => {
    if (auth0Client === undefined) {
      throw new Error('Auth0 has not been initialized')
    }

    return auth0Client.getIdTokenClaims(options)
  }

  const loginWithRedirect = (options?: RedirectLoginOptions) => {
    if (auth0Client === undefined) {
      throw new Error('Auth0 has not been initialized')
    }

    return auth0Client.loginWithRedirect(options)
  }

  const getTokenSilently = (options?: GetTokenSilentlyOptions) => {
    if (auth0Client === undefined) {
      throw new Error('Auth0 has not been initialized')
    }

    return auth0Client.getTokenSilently(options)
  }

  const getTokenWithPopup = (options?: GetTokenWithPopupOptions) => {
    if (auth0Client === undefined) {
      throw new Error('Auth0 has not been initialized')
    }

    return auth0Client.getTokenWithPopup(options)
  }

  const logout = (options?: LogoutOptions) => {
    if (auth0Client === undefined) {
      throw new Error('Auth0 has not been initialized')
    }

    return auth0Client.logout(options)
  }

  return (
    <Auth0Context.Provider
      value={{
        user,
        isAuthenticated,
        isInitializing,
        isPopupOpen,
        loginWithPopup,
        loginWithRedirect,
        logout
        // handleRedirectCallback,
        // getIdTokenClaims,
        // getTokenSilently,
        // getTokenWithPopup
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};