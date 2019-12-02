import { Context, CustomAuthorizerEvent, CustomAuthorizerHandler, CustomAuthorizerResult } from 'aws-lambda'
import jwt from 'jsonwebtoken'
import jwksClient, { CertSigningKey, RsaSigningKey } from 'jwks-rsa'
import {
  logInvocation
} from './lib/lambda'
import { promisify } from 'util'

const auth0Domain = process.env.AUTH0_DOMAIN
const auth0APIAudience = process.env.AUTH0_API_AUDIENCE

if (
  auth0Domain === undefined
  || auth0APIAudience === undefined
) {
  throw new Error('env vars not set')
}

const auth0Issuer = `https://${auth0Domain}/`

const authClient = jwksClient({
  cache: true,
  jwksUri: `https://${auth0Domain}/.well-known/jwks.json`
})

interface DecodedToken {
  header: {
    kid?: string
  }
}

interface DecodedJWT {
  sub: string
  iss: string
  azp: string
  scope: string
  aud: string[]
  iat: number
  exp: number
}

const getSigningKey = promisify(authClient.getSigningKey.bind(authClient))

/**
 * Handle an authorization request for invoking a lambda function.
 * 
 * Note that throwing from the lambda handler results in authorization being denied.
 */
export const handleAuthVerification: CustomAuthorizerHandler = async (
  event: CustomAuthorizerEvent,
  context: Context
) => {
  logInvocation('auth.handleAuthVerification', event, context)
  
  if (event.type !== 'TOKEN') {
    throw new Error('Invalid event type from custom authorizer')
  }

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
  
  // Throws if the token is invalid e.g. due to user not being authenticated
  // For given audience and issuer
  const decoded = jwt.verify(authToken, publicKey, {
    algorithms: ['RS256'],
    audience: auth0APIAudience,
    issuer: auth0Issuer
  })

  console.log('decoded jwt token: %O', decoded)

  if (isDecodedJWT(decoded)) {
    const IAMPolicy = generatePolicy(decoded.sub, 'Allow', event.methodArn)

    // ToDo: check user roles here
    // I.e. does this user have permission to access this route

    return IAMPolicy
  }
  else {
    throw new Error('decoded jwt does not have required keys')
  }
}

const isDecodedJWT = (decoded: string | object): decoded is DecodedJWT =>
  typeof decoded === 'object' && typeof (decoded as DecodedJWT).sub === 'string'

const keyIsCert = (key: CertSigningKey | RsaSigningKey): key is CertSigningKey =>
  (key as CertSigningKey).publicKey !== undefined

/*

  We need to generate an IAM policy that will allow invocation of a functionName
  
  The resource looks like:
  arn:aws:execute-api:<region>:<account_id>:<restapi_id>/<stage>/<httpVerb>/<path>
  
  E.g.:
  arn:aws:execute-api:us-west-2:31241241223:d3ul21vxig/prod/POST/get-forms

 */
function generatePolicy (principalId: string, effect: string, resource: string) {
  const policyStatement = {
    Action: 'execute-api:Invoke',
    Effect: effect,
    Resource: resource,
  }

  const authResponse: CustomAuthorizerResult = {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        policyStatement
      ]
    }
  }
  
  // Optionally add additional context for next function to consume
  // authResponse.context = {
  //   "stringKey": "stringval",
  //   "numberKey": 123,
  //   "booleanKey": true
  // }

  return authResponse
}