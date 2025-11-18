import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { initializeDatabase } from './services/database';
import { handleUserUpsert } from './routes/users';
import { notFound, internalError } from './utils/response';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // 데이터베이스 초기화
    await initializeDatabase();

    const path = event.path || '';

    // health 체크
    if (path === '/health' && event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ok' }),
      };
    }

    // 유저 업서트 엔드포인트
    if (path.includes('/users/upsert')) {
      return await handleUserUpsert(event);
    }

    return notFound();
  } catch (error) {
    console.error('Handler error:', error);
    return internalError();
  }
};
