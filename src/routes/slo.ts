import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { prisma } from '../prisma';
import { extractUserId } from '../utils/auth';
import { success, created, unauthorized, methodNotAllowed, internalError } from '../utils/response';
import { SloSettings } from '../types';

export const handleSloSettings = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = extractUserId(event);
  if (!userId) {
    return unauthorized();
  }

  try {
    if (event.httpMethod === 'GET') {
      const settings = await prisma.sloSettings.findMany({
        where: { user_id: userId }
      });
      return success(settings);
    }

    if (event.httpMethod === 'POST') {
      const body: Omit<SloSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'> = JSON.parse(event.body || '{}');
      const setting = await prisma.sloSettings.create({
        data: { user_id: userId, ...body }
      });
      return created(setting);
    }

    return methodNotAllowed();
  } catch (error) {
    console.error('SLO settings error:', error);
    return internalError();
  }
};
