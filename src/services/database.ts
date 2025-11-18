import { prisma } from '../prisma';

let isInitialized = false;

export const initializeDatabase = async (): Promise<void> => {
  if (isInitialized) return;

  try {
    // users 테이블만 보장합니다. Prisma의 마이그레이션 사용이 권장되지만,
    // 간편하게 Lambda 초기화 시 테이블을 생성하도록 합니다.
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        github_id VARCHAR(255) UNIQUE,
        google_id VARCHAR(255) UNIQUE,
        login VARCHAR(255),
        email VARCHAR(255),
        avatar_url VARCHAR(500),
        provider VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    isInitialized = true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};
