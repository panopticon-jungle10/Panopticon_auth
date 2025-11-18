#!/bin/bash

# Panopticon Lambda Backend 배포 스크립트

set -e

echo "🚀 Starting deployment..."

# 빌드
echo "📦 Building application..."
npm run build

# Prisma 클라이언트 생성
echo "🔧 Generating Prisma client..."
npx prisma generate

# 배포 패키지 생성
echo "📦 Creating deployment package..."
zip -r deployment.zip dist/ node_modules/ prisma/

# S3에 업로드 (백업용)
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
echo "☁️ Uploading to S3..."
aws s3 cp deployment.zip s3://panopticon-lambda-deployment-fixed/deployment-${TIMESTAMP}.zip

# Lambda 함수 업데이트
echo "⚡ Updating Lambda function..."
aws lambda update-function-code \
  --function-name panopticon-backend \
  --zip-file fileb://deployment.zip \
  --region ap-northeast-2

# 업데이트 완료 대기
echo "⏳ Waiting for update to complete..."
aws lambda wait function-updated \
  --function-name panopticon-backend \
  --region ap-northeast-2

echo "✅ Deployment completed successfully!"

# 정리
rm deployment.zip
echo "🧹 Cleanup completed"
