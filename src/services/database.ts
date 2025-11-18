import { prisma } from '../prisma';

let isInitialized = false;

export const initializeDatabase = async (): Promise<void> => {
  if (isInitialized) return;
  
  try {
    // slo_settings 테이블만 재생성 (스키마 불일치 해결)
    await prisma.$executeRaw`DROP TABLE IF EXISTS slo_settings CASCADE`;
    
    // 테이블 초기화
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS notification_settings (
        id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
        user_id VARCHAR(255) UNIQUE NOT NULL,
        slack_webhook_url VARCHAR(500),
        notification_enabled BOOLEAN DEFAULT true,
        error_level_filter VARCHAR(255) DEFAULT 'ERROR',
        service_filters TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await prisma.$executeRaw`
      CREATE TABLE slo_settings (
        id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
        user_id VARCHAR(255) NOT NULL,
        service_name VARCHAR(255) NOT NULL,
        metric_type VARCHAR(255) NOT NULL,
        threshold_value DECIMAL(10,2) NOT NULL,
        time_window VARCHAR(255) NOT NULL,
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
