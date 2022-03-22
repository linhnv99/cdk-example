import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda';
import { PrismaClient } from '@prisma/client'
import { SecretsManager } from 'aws-sdk'

const sm = new SecretsManager()
let db: PrismaClient

export async function main(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  
  const dbURL = await sm
    .getSecretValue({
      SecretId: process.env.SECRET_ID || '',
    })
    .promise()

  const secretString = JSON.parse(dbURL.SecretString || '{}')
  const url = `mysql://${secretString.username}:${secretString.password}@${secretString.host}:${secretString.port}/${secretString.dbname}?connection_limit=1`
 
  db = new PrismaClient({
    datasources: { db: { url } },
  })

  const users = await db.user.findMany() || ["SAI"]
  return users;
}