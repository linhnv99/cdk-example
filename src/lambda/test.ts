import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda';

export async function test(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  
  
  return "Ok"
}