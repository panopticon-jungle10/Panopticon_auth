import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { UpsertUserRequest } from '../types';
import { success, badRequest, internalError } from '../utils/response';
import { validateUpsertUserRequest } from '../utils/validation';
import { upsertUser } from '../services/user';

/**
 * POST /users/upsert
 * 유저 정보 생성 또는 업데이트 (소셜 로그인용)
 */
export const handleUserUpsert = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (event.httpMethod !== 'POST') {
      return badRequest('Only POST method is allowed');
    }

    if (!event.body) {
      return badRequest('Request body is required');
    }

    const body: UpsertUserRequest = JSON.parse(event.body);

    // 요청 바디 검증
    const validationError = validateUpsertUserRequest(body);
    if (validationError) {
      return badRequest(validationError);
    }

    // 유저 생성 또는 업데이트
    const user = await upsertUser(body);

    return success({
      message: 'User upserted successfully',
      user: {
        id: user.id,
        github_id: user.github_id,
        google_id: user.google_id,
        login: user.login,
        email: user.email,
        avatar_url: user.avatar_url,
        provider: user.provider,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (error) {
    console.error('User upsert error:', error);
    return internalError();
  }
};
