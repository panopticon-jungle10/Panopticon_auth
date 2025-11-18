# Panopticon Lambda Backend

AWS Lambda 기반의 서버리스 백엔드 API 서비스입니다. 알림 설정 관리와 SLO 설정 관리 기능을 제공합니다.

## 📁 프로젝트 구조

```
lambda-backend/
├── src/
│   ├── types/
│   │   └── index.ts              # 타입 정의
│   ├── config/
│   │   └── index.ts              # 설정 관리
│   ├── utils/
│   │   ├── response.ts           # HTTP 응답 유틸리티
│   │   └── auth.ts               # 인증 유틸리티
│   ├── services/
│   │   └── database.ts           # 데이터베이스 초기화
│   ├── routes/
│   │   ├── notifications.ts      # 알림 관련 라우터
│   │   └── slo.ts               # SLO 관련 라우터
│   ├── index.ts                 # 메인 Lambda 핸들러
│   └── prisma.ts                # Prisma 클라이언트
├── prisma/
│   └── schema.prisma            # 데이터베이스 스키마
├── package.json
├── tsconfig.json
└── README.md
```

## 📋 파일별 역할

### 🎯 **Core Files**

#### `src/index.ts`
- **역할**: 메인 Lambda 핸들러
- **기능**: 
  - 데이터베이스 초기화
  - 요청 라우팅
  - 전역 에러 처리

#### `src/prisma.ts`
- **역할**: Prisma 클라이언트 인스턴스
- **기능**: 데이터베이스 연결 관리

### 🏗️ **Architecture Layers**

#### `src/types/index.ts`
- **역할**: 타입 정의 중앙화
- **포함 타입**:
  - `NotificationSettings`: 알림 설정
  - `SloSettings`: SLO 설정
  - `SlackMessage`: Slack 메시지 구조
  - `LogEntry`: 로그 엔트리
  - `ApiResponse`: API 응답

#### `src/config/index.ts`
- **역할**: 애플리케이션 설정 관리
- **포함 설정**:
  - CORS 설정
  - 데이터베이스 설정
  - 기본값 설정
  - HTTP 상태 코드 상수

#### `src/utils/`
- **`response.ts`**: HTTP 응답 생성 유틸리티
  - 표준화된 응답 형식
  - 상태 코드별 헬퍼 함수
- **`auth.ts`**: 인증 관련 유틸리티
  - 사용자 ID 추출
  - Bearer 토큰 처리

#### `src/services/database.ts`
- **역할**: 데이터베이스 초기화 서비스
- **기능**:
  - 테이블 생성
  - 스키마 마이그레이션
  - 초기화 상태 관리

#### `src/routes/`
- **`notifications.ts`**: 알림 관련 API 라우터
  - GET `/notifications/settings`: 알림 설정 조회
  - POST `/notifications/settings`: 알림 설정 저장
  - POST `/notifications/send`: Slack 알림 전송
- **`slo.ts`**: SLO 관련 API 라우터
  - GET `/slo/settings`: SLO 설정 조회
  - POST `/slo/settings`: SLO 설정 생성

### 📊 **Database Schema**

#### `prisma/schema.prisma`
- **역할**: 데이터베이스 스키마 정의
- **테이블**:
  - `users`: 사용자 정보
  - `notification_settings`: 알림 설정
  - `slo_settings`: SLO 설정

## 🚀 API 엔드포인트

### 알림 설정 API

#### `GET /notifications/settings`
```bash
# Query Parameter 방식
GET /notifications/settings?userId=test-user

# Bearer Token 방식  
GET /notifications/settings
Authorization: Bearer test-user
```

**응답**:
```json
{
  "notification_enabled": true,
  "error_level_filter": "ERROR",
  "service_filters": []
}
```

#### `POST /notifications/settings`
```bash
POST /notifications/settings?userId=test-user
Content-Type: application/json

{
  "slack_webhook_url": "https://hooks.slack.com/...",
  "notification_enabled": true,
  "error_level_filter": "ERROR",
  "service_filters": ["service1", "service2"]
}
```

#### `POST /notifications/send`
```bash
POST /notifications/send
Content-Type: application/json

{
  "userId": "test-user",
  "log": {
    "service_name": "api-server",
    "level": "ERROR",
    "message": "Database connection failed",
    "timestamp": "2025-11-18T10:30:00Z"
  }
}
```

### SLO 설정 API

#### `GET /slo/settings`
```bash
GET /slo/settings
Authorization: Bearer test-user
```

#### `POST /slo/settings`
```bash
POST /slo/settings
Authorization: Bearer test-user
Content-Type: application/json

{
  "service_name": "api-server",
  "metric_type": "availability",
  "threshold_value": 99.9,
  "time_window": "24h"
}
```

## 🚀 CI/CD 파이프라인

### GitHub Actions 설정

1. **Repository Secrets 설정**:
   ```
   AWS_ACCESS_KEY_ID: <your-access-key>
   AWS_SECRET_ACCESS_KEY: <your-secret-key>
   ```

2. **자동 배포**: `main` 브랜치에 push 시 자동 배포
3. **테스트**: PR 생성 시 자동 테스트 실행

### 수동 배포

```bash
# 로컬에서 직접 배포
./deploy.sh
```

### 배포 과정

1. TypeScript 컴파일
2. Prisma 클라이언트 생성  
3. 배포 패키지 생성 (zip)
4. S3 백업 업로드
5. Lambda 함수 업데이트

## 🛠️ 개발 환경 설정

### 필수 요구사항
- Node.js 20.x
- AWS CLI 설정
- PostgreSQL 데이터베이스

### 환경 변수
```bash
DATABASE_URL=postgresql://username:password@host:5432/database
```

### 빌드 및 배포
```bash
# 의존성 설치
npm install

# TypeScript 컴파일
npm run build

# 배포 패키지 생성
zip -r deployment.zip dist/ node_modules/ prisma/

# Lambda 함수 업데이트
aws lambda update-function-code \
  --function-name panopticon-backend \
  --zip-file fileb://deployment.zip
```

## 🏛️ 아키텍처 특징

### ✅ **책임 분리**
- 각 레이어별 명확한 역할 분담
- 라우터, 서비스, 유틸리티 분리

### ✅ **타입 안전성**
- TypeScript 강타입 시스템 활용
- 모든 API 인터페이스 타입 정의

### ✅ **설정 중앙화**
- 환경별 설정 관리
- 상수 및 기본값 중앙 관리

### ✅ **에러 처리**
- 표준화된 에러 응답
- 레이어별 적절한 에러 핸들링

### ✅ **확장성**
- 모듈화된 구조로 기능 추가 용이
- 재사용 가능한 유틸리티 함수

## 🔧 주요 기술 스택

- **Runtime**: Node.js 20.x
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Platform**: AWS Lambda
- **Build**: TypeScript Compiler
