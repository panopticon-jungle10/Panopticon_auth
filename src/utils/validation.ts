import { UpsertUserRequest } from '../types';

/**
 * UpsertUserRequest 필수 필드 검증
 */
export const validateUpsertUserRequest = (body: Partial<UpsertUserRequest>): string | null => {
  const { github_id, google_id, login, email, avatar_url, provider } = body;

  if (!login || !email || !avatar_url || !provider) {
    return 'Missing required fields: login, email, avatar_url, provider';
  }

  if (!github_id && !google_id) {
    return 'Either github_id or google_id is required';
  }

  if (provider !== 'github' && provider !== 'google') {
    return 'Provider must be either "github" or "google"';
  }

  if (provider === 'github' && !github_id) {
    return 'github_id is required when provider is "github"';
  }

  if (provider === 'google' && !google_id) {
    return 'google_id is required when provider is "google"';
  }

  return null;
};