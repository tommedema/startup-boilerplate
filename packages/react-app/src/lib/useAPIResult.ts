import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth0 } from './auth0'

const apiRoot = process.env.API_ROOT

if (apiRoot === undefined) {
  throw new Error('undefined env var API_ROOT')
}

/**
 * React hook that fetches an API result. Results in a re-render when
 * the API responds.
 */
const useAPIResult = <B, T>(
  resourcePath: string,
  bodyParser: (body: B) => T,
  skipAuthentication = false
) => {
  const [result, setResult] = useState<T>()
  const { getTokenSilently } = useAuth0()

  const initiateFetch = () => {
    const axiosSource = axios.CancelToken.source()

    const fetchApiResult = async () => {

      const headers: Record<string, string> = {}
      if (!skipAuthentication) {
        const token = await getTokenSilently()
        headers['Authorization'] = `Bearer ${token}`
      }

      const axiosResponse = await axios.request<B>({
        url: `${apiRoot}/${resourcePath}`,
        method: 'get',
        headers
      })
    
      const parsed = bodyParser(axiosResponse.data)

      setResult(parsed)
    }

    const cancelFetch = () => {
      axiosSource.cancel('Component unmounted')
    }

    fetchApiResult()

    return cancelFetch
  }

  useEffect(initiateFetch, [])

  return result
}

export default useAPIResult