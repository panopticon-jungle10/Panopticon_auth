import { APIGatewayProxyEvent } from 'aws-lambda';

export const extractUserId = (event: APIGatewayProxyEvent): string | null => {
  // Bearer token에서 추출
  const authHeader = event.headers?.authorization || event.headers?.Authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.replace('Bearer ', '');
  }
  
  // Query parameter에서 추출
  const queryUserId = event.queryStringParameters?.userId;
  if (queryUserId) {
    return queryUserId;
  }
  
  return null;
};
