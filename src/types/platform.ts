export interface FeedbackCreateInput {
  name?: string;
  email?: string;
  category: 'bug' | 'suggestion' | 'feature_request' | 'general';
  rating?: number;
  title: string;
  message: string;
}

export interface FeedbackItem {
  id: number;
  user_id?: string;
  name?: string;
  email?: string;
  category: string;
  rating?: number;
  title: string;
  message: string;
  status: 'new' | 'reviewed' | 'resolved';
  admin_notes?: string;
  created_at: string;
}

export interface ProductEventInput {
  event_name: string;
  category?: 'engagement' | 'analytics' | 'prediction' | 'system';
  properties?: Record<string, any>;
  session_id?: string;
}

export interface ProductAnalyticsSummary {
  total_events: number;
  unique_sessions: number;
  top_events: Array<{ name: string; count: number }>;
  events_by_category: Record<string, number>;
  recent_activity: Array<{ event: string; category: string; timestamp: string }>;
}

export interface SystemDiagnostics {
  status: string;
  version: string;
  uptime_seconds: number;
  database: Record<string, number>;
  memory_rss_mb: number;
  active_endpoints: number;
  prediction_models: Record<string, string>;
  live_relay_status: string;
  security_headers_enabled: boolean;
}
