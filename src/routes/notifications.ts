import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { prisma } from '../prisma';
import { extractUserId } from '../utils/auth';
import { success, unauthorized, methodNotAllowed, internalError } from '../utils/response';
import { config } from '../config';
import { NotificationSettings, LogEntry, SlackMessage } from '../types';
import https from 'https';
import { URL } from 'url';

export const handleNotificationSettings = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const userId = extractUserId(event);
  if (!userId) {
    return unauthorized();
  }

  try {
    if (event.httpMethod === 'GET') {
      const settings = await prisma.notificationSettings.findUnique({
        where: { user_id: userId }
      });
      
      return success(settings || {
        notification_enabled: config.defaults.notification.enabled,
        error_level_filter: config.defaults.notification.errorLevel,
        service_filters: config.defaults.notification.serviceFilters
      });
    }

    if (event.httpMethod === 'POST') {
      const body: Partial<NotificationSettings> = JSON.parse(event.body || '{}');
      const settings = await prisma.notificationSettings.upsert({
        where: { user_id: userId },
        update: body,
        create: { user_id: userId, ...body }
      });
      return success(settings);
    }

    return methodNotAllowed();
  } catch (error) {
    console.error('Notification settings error:', error);
    return internalError();
  }
};

export const handleSlackNotification = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const body: { userId: string; log: LogEntry } = JSON.parse(event.body || '{}');
    const { userId, log } = body;

    const settings = await prisma.notificationSettings.findUnique({
      where: { user_id: userId }
    });

    if (!settings?.notification_enabled || !settings.slack_webhook_url) {
      return success({ message: 'Notification disabled' });
    }

    // 필터 확인
    if (settings.service_filters.length > 0 && !settings.service_filters.includes(log.service_name)) {
      return success({ message: 'Service filtered' });
    }

    if (log.level !== settings.error_level_filter && settings.error_level_filter !== 'ALL') {
      return success({ message: 'Level filtered' });
    }

    const slackMessage: SlackMessage = {
      text: `🚨 에러 로그 알림 - ${log.service_name}`,
      blocks: [
        {
          type: "header",
          text: { type: "plain_text", text: `🚨 ${log.service_name} 에러 발생` }
        },
        {
          type: "section",
          fields: [
            { type: "mrkdwn", text: `*서비스:* ${log.service_name}` },
            { type: "mrkdwn", text: `*레벨:* ${log.level}` },
            { type: "mrkdwn", text: `*시간:* ${new Date(log.timestamp).toLocaleString('ko-KR')}` }
          ]
        },
        {
          type: "section",
          text: { type: "mrkdwn", text: `*에러 메시지:*\n\`\`\`${log.message}\`\`\`` }
        }
      ]
    };

    await sendToSlack(settings.slack_webhook_url, slackMessage);
    return success({ success: true });
  } catch (error) {
    console.error('Slack notification error:', error);
    return internalError();
  }
};

const sendToSlack = (webhookUrl: string, message: SlackMessage): Promise<void> => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(message);
    const url = new URL(webhookUrl);
    
    const req = https.request({
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
    }, (res) => {
      res.statusCode === 200 ? resolve() : reject(new Error(`Slack API error: ${res.statusCode}`));
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
};
