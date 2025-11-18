#!/bin/bash

# Lambda 함수 테스트 스크립트
FUNCTION_NAME="panopticon-backend"
REGION="ap-northeast-2"

echo "========================================"
echo "AWS Lambda 테스트 시작"
echo "Function: $FUNCTION_NAME"
echo "Region: $REGION"
echo "========================================"

# 1. Health Check 테스트
echo -e "\n[1] Health Check 테스트..."
aws lambda invoke \
  --function-name $FUNCTION_NAME \
  --region $REGION \
  --payload '{"httpMethod":"GET","path":"/health","headers":{},"body":null}' \
  --cli-binary-format raw-in-base64-out \
  response-health.json

echo "Response:"
cat response-health.json | jq '.'

# 2. GitHub User Upsert 테스트
echo -e "\n[2] GitHub User Upsert 테스트..."
aws lambda invoke \
  --function-name $FUNCTION_NAME \
  --region $REGION \
  --payload '{
    "httpMethod": "POST",
    "path": "/users/upsert",
    "headers": {"Content-Type": "application/json"},
    "body": "{\"provider\":\"github\",\"github_id\":\"test-github-123\",\"login\":\"testuser\",\"email\":\"test@github.com\",\"avatar_url\":\"https://avatars.githubusercontent.com/u/123\"}"
  }' \
  --cli-binary-format raw-in-base64-out \
  response-github.json

echo "Response:"
cat response-github.json | jq '.'

# 3. Google User Upsert 테스트
echo -e "\n[3] Google User Upsert 테스트..."
aws lambda invoke \
  --function-name $FUNCTION_NAME \
  --region $REGION \
  --payload '{
    "httpMethod": "POST",
    "path": "/users/upsert",
    "headers": {"Content-Type": "application/json"},
    "body": "{\"provider\":\"google\",\"google_id\":\"test-google-456\",\"login\":\"testuser2\",\"email\":\"test@gmail.com\",\"avatar_url\":\"https://lh3.googleusercontent.com/a/456\"}"
  }' \
  --cli-binary-format raw-in-base64-out \
  response-google.json

echo "Response:"
cat response-google.json | jq '.'

# 정리
echo -e "\n========================================"
echo "테스트 완료!"
echo "응답 파일: response-*.json"
echo "========================================"
