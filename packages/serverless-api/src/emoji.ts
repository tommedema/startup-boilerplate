import { APIGatewayEvent, Context } from 'aws-lambda'
import stringToEmoji from '@org/string-to-emoji'
import { getLambdaProxyResponse, logInvocation, assertAPIVersion, getPathParameter } from './lib/lambda'

export async function getEmojiFromStringHandler (
  event: APIGatewayEvent,
  context: Context
) {
  logInvocation('getEmojiFromStringHandler', event, context)
  assertAPIVersion(event, 'v1')
  
  const inputString = getPathParameter(event, 'inputString')
  const emoji = stringToEmoji(inputString)

  return getLambdaProxyResponse<string>(200, emoji)
}