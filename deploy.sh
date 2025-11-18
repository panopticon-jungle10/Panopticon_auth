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

# S3에 업로드 및 Lambda 업데이트
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
S3_KEY="deployment-${TIMESTAMP}.zip"

echo "☁️ Uploading to S3..."
aws s3 cp deployment.zip s3://panopticon-lambda-deployment-fixed/${S3_KEY}

echo "⚡ Updating Lambda function..."
aws lambda update-function-code \
  --function-name panopticon-backend \
  --s3-bucket panopticon-lambda-deployment-fixed \
  --s3-key ${S3_KEY} \
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
