import React, { useState, useEffect, useContext, ReactChild } from 'react'
import createAuth0Client from '@auth0/auth0-spa-js'
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client'

export interface Auth0RedirectState {
  targetUrl?: string
}

export interface Auth0User extends Omit<IdToken, '__raw'> {}

interface Auth0ProviderArguments extends Auth0ClientOptions {
  children: ReactChild
  onRedirectCallback: (appState?: Auth0RedirectState) => void 
}

interface Auth0ContextProviderProps<U extends Auth0User> {
  user?: U
  isAuthenticated: boolean
  isInitializing: boolean
  isPopupOpen: boolean
  loginWithPopup: (options?: PopupLoginOptions) => Promise<void>,
  loginWithRedirect: (options?: RedirectLoginOptions) => Promise<void>,
  getTokenSilently: (options?: GetTokenSilentlyOptions) => Promise<void>,
  logout: (options?: LogoutOptions) => void
}

const initialContext = {
  user: {},
  isAuthenticated: false,
  isInitializing: true,
  isPopupOpen: false,
  loginWithPopup: async () => {},
  loginWithRedirect: async () => {},
  getTokenSilently: async () => {},
  logout: () => {}
}

const Auth0Context = React.createContext<Auth0ContextProviderProps<Auth0User>>(initialContext)

export const useAuth0 = () => useContext<Auth0ContextProviderProps<Auth0User>>(Auth0Context)

/**
 * @see https://github.com/auth0/auth0-spa-js
 * @see https://auth0.com/docs/quickstart/spa/react
 */
export const Auth0Provider = <U extends Auth0User>({
  children,
  onRedirectCallback,
  ...initOptions
}: Auth0ProviderArguments) => {
  const [isAuthenticated, setIsAuthenticated] = useState(initialContext.isAuthenticated)
  const [isInitializing, setIsInitializing] = useState(initialContext.isInitializing)
  const [isPopupOpen, setIsPopupOpen] = useState(initialContext.isPopupOpen)
  const [user, setUser] = useState<U>()
  const [auth0Client, setAuth0Client] = useState<Auth0Client>()

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions)
      setAuth0Client(auth0FromHook)

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
    const auth0Client = assertAuth0Client()

    setIsPopupOpen(true)

    try {
      await auth0Client.loginWithPopup(options)
    } catch (error) {
      console.error(error)
    } finally {
      setIsPopupOpen(false)
    }

    const userProfile = await auth0Client.getUser()
    setUser(userProfile)

    setIsAuthenticated(true)
  }

  const loginWithRedirect = (options?: RedirectLoginOptions) =>
    assertAuth0Client().loginWithRedirect(options)

  const getTokenSilently = (options?: GetTokenSilentlyOptions) =>
    assertAuth0Client().getTokenSilently(options)

  const logout = (options?: LogoutOptions) =>
    assertAuth0Client().logout(options)

  const assertAuth0Client = (): Auth0Client => {
    if (auth0Client === undefined) {
      throw new Error('Auth0 has not been initialized')
    }

    return auth0Client
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
        logout,
        getTokenSilently
        // handleRedirectCallback
        // getIdTokenClaims
        // getTokenWithPopup
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};