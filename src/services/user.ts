import { prisma } from '../prisma';
import { UpsertUserRequest, User } from '../types';

/**
 * GitHub ID로 유저를 찾거나 생성
 */
export const upsertUserByGithub = async (data: UpsertUserRequest): Promise<User> => {
  if (!data.github_id) {
    throw new Error('github_id is required for GitHub user upsert');
  }

  const user = await prisma.user.upsert({
    where: { github_id: data.github_id },
    update: {
      login: data.login,
      email: data.email,
      avatar_url: data.avatar_url,
      provider: data.provider,
      updated_at: new Date(),
    },
    create: {
      github_id: data.github_id,
      login: data.login,
      email: data.email,
      avatar_url: data.avatar_url,
      provider: data.provider,
    },
  });

  return user;
};

/**
 * Google ID로 유저를 찾거나 생성
 */
export const upsertUserByGoogle = async (data: UpsertUserRequest): Promise<User> => {
  if (!data.google_id) {
    throw new Error('google_id is required for Google user upsert');
  }

  const user = await prisma.user.upsert({
    where: { google_id: data.google_id },
    update: {
      login: data.login,
      email: data.email,
      avatar_url: data.avatar_url,
      provider: data.provider,
      updated_at: new Date(),
    },
    create: {
      google_id: data.google_id,
      login: data.login,
      email: data.email,
      avatar_url: data.avatar_url,
      provider: data.provider,
    },
  });

  return user;
};

/**
 * Provider에 따라 유저를 찾거나 생성 (통합 함수)
 */
export const upsertUser = async (data: UpsertUserRequest): Promise<User> => {
  if (data.provider === 'github') {
    return upsertUserByGithub(data);
  } else if (data.provider === 'google') {
    return upsertUserByGoogle(data);
  } else {
    throw new Error(`Unsupported provider: ${data.provider}`);
  }
};
