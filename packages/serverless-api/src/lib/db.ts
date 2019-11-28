import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { PromiseResult } from 'aws-sdk/lib/request'
import { AWSError } from 'aws-sdk'

const db = new DocumentClient({ apiVersion: '2012-08-10' })

export const putItem = async <T>(
  tableName: string,
  item: T
): Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError>> => {
  const result = await db.put({
    TableName: tableName,
    Item: item
  }).promise()

  return result
}