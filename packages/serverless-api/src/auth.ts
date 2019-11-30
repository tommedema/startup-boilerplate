import { Context, CustomAuthorizerEvent, CustomAuthorizerHandler } from 'aws-lambda'
import jwt from 'jsonwebtoken'
import jwksClient, { CertSigningKey, RsaSigningKey } from 'jwks-rsa'
import {
  logInvocation,
  assertAPIVersion
} from './lib/lambda'
import { promisify } from 'util'

const auth0Domain = process.env.AUTH0_DOMAIN

if (auth0Domain === undefined) {
  throw new Error('auth0 domain env var not set')
}

const authClient = jwksClient({
  cache: true,
  jwksUri: `https://${auth0Domain}/.well-known/jwks.json`
})

interface DecodedToken {
  header: {
    kid?: string
  }
}

const getSigningKey = promisify(authClient.getSigningKey.bind(authClient))

export const handleAuthVerification: CustomAuthorizerHandler = async (
  event: CustomAuthorizerEvent,
  context: Context
) => {
  logInvocation('auth.handleAuthVerification', event, context)
  assertAPIVersion(event, 'v1')

  if (!event.authorizationToken) {
    throw new Error('No JWT Token')
  }

  // Remove "Bearer " from token
  const authToken = event.authorizationToken.substring(7)
  if (!authToken) {
    throw new Error('No JWT Token post-bearer')
  }

  const decodedToken = jwt.decode(authToken, { complete: true }) as DecodedToken
  if (!decodedToken) {
    throw new Error('Empty decoded JWT token')
  }

  // Parse Signing key from auth0
  const kid = decodedToken.header.kid
  if (!kid) {
    throw new Error('No KID')
  }

  const signingKey = await getSigningKey(kid)
  const publicKey = keyIsCert(signingKey)
    ? signingKey.publicKey
    : signingKey.rsaPublicKey
  
  const decoded = jwt.verify(authToken, publicKey, { algorithms: ['RS256'] })

  console.log('decoded jwt token: %O', decoded)

  throw new Error('Unauthorized')
}

const keyIsCert = (key: CertSigningKey | RsaSigningKey): key is CertSigningKey =>
  (key as CertSigningKey).publicKey !== undefined