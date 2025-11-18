# Panopticon Lambda Backend (User-only)

이 저장소의 Lambda 백엔드는 현재 **사용자 정보(user)** 관리 기능만 제공합니다. 이전에 포함되어 있던 알림(notification) 또는 SLO 관련 기능은 제거되었거나 별도 서비스로 분리되었습니다.

## 📁 간단한 프로젝트 구조

```
lambda-backend/
├── src/
│   ├── types/
│   │   └── index.ts        # User 관련 타입 정의
│   ├── config/
│   │   └── index.ts        # 설정 관리
│   ├── services/
│   │   └── database.ts     # Prisma 초기화 등 DB 연결
│   ├── routes/
│   │   └── users.ts        # 사용자 CRUD 엔드포인트
+│   ├── index.ts            # Lambda 핸들러 (라우팅)
│   └── prisma.ts           # Prisma 클라이언트
├── prisma/
│   └── schema.prisma       # users 테이블 스키마
├── package.json
├── tsconfig.json
└── README.md
```

## 핵심 책임

- 사용자 생성, 조회, 수정, 삭제 (CRUD)
- 요청 인증(옵션) 및 간단한 입력 검증
- Prisma를 통한 PostgreSQL 연동

## 제공되는 (예시) 엔드포인트

- `GET /users/{id}` — 사용자 조회
- `POST /users` — 사용자 생성
- `PUT /users/{id}` — 사용자 업데이트
- `DELETE /users/{id}` — 사용자 삭제

요청 예시 (새 사용자 생성):

```bash
POST /users
Content-Type: application/json

{
  "id": "user-123",
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

인증 예시 (선택적):

```
Authorization: Bearer <token>
```

## 데이터베이스 스키마 (요약)

`prisma/schema.prisma`에는 `users` 테이블(또는 모델)만 유지되어야 합니다. 예:

```prisma
model User {
  id        String @id
  name      String
  email     String @unique
  createdAt DateTime @default(now())
}
```

## 개발 및 배포

요구사항:

- Node.js 20.x
- PostgreSQL
- AWS CLI (Lambda에 배포할 경우)

환경변수 예시:

```bash
DATABASE_URL=postgresql://username:password@host:5432/database
```

로컬 빌드 및 배포(간단):

```bash
npm install
npm run build
./deploy.sh    # 저장소에 포함된 배포 스크립트가 있는 경우
```