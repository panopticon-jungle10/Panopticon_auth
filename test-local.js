/**
 * 로컬 Lambda 함수 테스트 스크립트
 *
 * 실행 방법:
 * node test-local.js
 */

require('dotenv').config();
const { handler } = require('./dist/index');

// 테스트 1: Health Check
async function testHealthCheck() {
  console.log('\n=== Test 1: Health Check ===');

  const event = {
    httpMethod: 'GET',
    path: '/health',
    headers: {},
    body: null,
  };

  try {
    const result = await handler(event);
    console.log('Status:', result.statusCode);
    console.log('Response:', JSON.parse(result.body));
  } catch (error) {
    console.error('Error:', error);
  }
}

// 테스트 2: GitHub User Upsert
async function testGithubUserUpsert() {
  console.log('\n=== Test 2: GitHub User Upsert ===');

  const event = {
    httpMethod: 'POST',
    path: '/users/upsert',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      provider: 'github',
      github_id: 'test-github-123',
      login: 'testuser',
      email: 'test@github.com',
      avatar_url: 'https://avatars.githubusercontent.com/u/123',
    }),
  };

  try {
    const result = await handler(event);
    console.log('Status:', result.statusCode);
    console.log('Response:', JSON.parse(result.body));
  } catch (error) {
    console.error('Error:', error);
  }
}

// 테스트 3: Google User Upsert
async function testGoogleUserUpsert() {
  console.log('\n=== Test 3: Google User Upsert ===');

  const event = {
    httpMethod: 'POST',
    path: '/users/upsert',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      provider: 'google',
      google_id: 'test-google-456',
      login: 'testuser2',
      email: 'test@gmail.com',
      avatar_url: 'https://lh3.googleusercontent.com/a/456',
    }),
  };

  try {
    const result = await handler(event);
    console.log('Status:', result.statusCode);
    console.log('Response:', JSON.parse(result.body));
  } catch (error) {
    console.error('Error:', error);
  }
}

// 모든 테스트 실행
async function runAllTests() {
  console.log('🚀 Starting local Lambda tests...\n');

  await testHealthCheck();
  await testGithubUserUpsert();
  await testGoogleUserUpsert();

  console.log('\n✅ All tests completed!\n');
  process.exit(0);
}

runAllTests().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
