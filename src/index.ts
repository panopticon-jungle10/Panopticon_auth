import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { initializeDatabase } from './services/database';
import { handleNotificationSettings, handleSlackNotification } from './routes/notifications';
import { handleSloSettings } from './routes/slo';
import { notFound, internalError } from './utils/response';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // 데이터베이스 초기화
    await initializeDatabase();

    const path = event.path;
    
    // 라우팅
    if (path.includes('/notifications/settings')) {
      return await handleNotificationSettings(event);
    }
    
    if (path.includes('/notifications/send')) {
      return await handleSlackNotification(event);
    }

    if (path.includes('/slo/settings')) {
      return await handleSloSettings(event);
    }

    return notFound();
  } catch (error) {
    console.error('Handler error:', error);
    return internalError();
  }
};
