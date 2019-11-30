import { APIGatewayProxyResult, APIGatewayProxyEvent, Context } from 'aws-lambda'
import { isNull } from 'util'

export interface GenericAPIGatewayEvent {
  pathParameters?: { [name: string]: string } | null 
}

export const getLambdaProxyResponse = <T>(
  statusCode: number,
  body?: T
): APIGatewayProxyResult => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    // Required for CORS support to work
    'Access-Control-Allow-Origin': '*',
    // Required for cookies, authorization headers with HTTPS
    'Access-Control-Allow-Credentials': true
  },
  body: body !== undefined ? JSON.stringify(body) : ''
})

export const logInvocation = <E = APIGatewayProxyEvent>(
  name: string,
  event: E,
  context: Context
): void =>
  console.log(`${name} invoked with:
  
    event: ${JSON.stringify(event)}
    context: ${JSON.stringify(context)}
  `)

export const getPathParameter = (
  event: GenericAPIGatewayEvent,
  key: string
): string => {
  const params = event.pathParameters

  if (isNull(params) || typeof params !== 'object') {
    throw new Error('path parameters undefined')
  }

  const val = params[key]

  if (typeof val !== 'string') {
    throw new Error(`${key} path parameter undefined`)
  }

  return val
}

export const assertAPIVersion = (
  event: GenericAPIGatewayEvent,
  version: string
): void => {
  const val = getPathParameter(event, 'version')
  if (val !== version) {
    throw new Error(
      `failed to assert API version:\n` +
      `required version: ${version}\n` +
      `received version: ${val}`
    )
  }
}