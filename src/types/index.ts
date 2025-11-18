export interface NotificationSettings {
  id?: string;
  user_id: string;
  slack_webhook_url?: string;
  notification_enabled: boolean;
  error_level_filter: string;
  service_filters: string[];
  created_at?: Date;
  updated_at?: Date;
}

export interface SloSettings {
  id?: string;
  user_id: string;
  service_name: string;
  metric_type: 'availability' | 'latency' | 'error_rate';
  threshold_value: number;
  time_window: '1h' | '24h' | '7d';
  created_at?: Date;
  updated_at?: Date;
}

export interface SlackMessage {
  text: string;
  blocks: Array<{
    type: string;
    text?: { type: string; text: string };
    fields?: Array<{ type: string; text: string }>;
  }>;
}

export interface LogEntry {
  service_name: string;
  level: string;
  message: string;
  timestamp: string;
}

export interface ApiResponse<T = any> {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}
