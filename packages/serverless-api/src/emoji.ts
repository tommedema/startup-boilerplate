import { APIGatewayEvent, Context } from 'aws-lambda'
import stringToEmoji from '@org/string-to-emoji'
import {
  getLambdaProxyResponse,
  logInvocation,
  assertAPIVersion,
  getPathParameter
} from './lib/lambda'
import * as db from './lib/db'
import uuid from 'uuid/v4'

interface StringToEmojiHash {
  id: string,
  input: string,
  emoji: string
}

if (process.env.EMOJI_HASHES_TABLE_NAME === undefined) {
  throw new Error('undefined env var EMOJI_HASHES_TABLE_NAME')
}

const emojisHashesTableName = process.env.EMOJI_HASHES_TABLE_NAME

export async function getEmojiFromStringHandler (
  event: APIGatewayEvent,
  context: Context
) {
  let statusCode = 200
  let result: StringToEmojiHash | undefined

  try {
    logInvocation('getEmojiFromStringHandler', event, context)
    assertAPIVersion(event, 'v1')
    
    // Hash input string to an emoji string
    const id = uuid()
    const input = getPathParameter(event, 'inputString')
    const emoji = stringToEmoji(input)
    result = {
      id,
      input,
      emoji
    }

    // Store each string to emoji hash lookup in dynamodb
    const putResult = await db.putItem<StringToEmojiHash>(
      emojisHashesTableName,
      result
    )
    console.log('db emoji put result: %O', putResult)
  }
  catch (e) {
    console.error(e)

    // Internal server error
    statusCode = 500
  }

  return getLambdaProxyResponse<StringToEmojiHash>(statusCode, result)
}