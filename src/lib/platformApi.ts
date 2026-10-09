import {
  FeedbackCreateInput,
  FeedbackItem,
  ProductEventInput,
  ProductAnalyticsSummary,
  SystemDiagnostics
} from '@/types/platform';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('apex_jwt_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  let sid = sessionStorage.getItem('apex_session_id');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2, 10);
    sessionStorage.setItem('apex_session_id', sid);
  }
  return sid;
}

export async function submitFeedback(input: FeedbackCreateInput): Promise<FeedbackItem> {
  const res = await fetch(`${API_BASE}/api/v1/platform/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to submit feedback.');
  }
  return res.json();
}

export async function fetchFeedbackList(category?: string, statusFilter?: string): Promise<FeedbackItem[]> {
  const params = new URLSearchParams();
  if (category && category !== 'all') params.append('category', category);
  if (statusFilter && statusFilter !== 'all') params.append('status_filter', statusFilter);

  const res = await fetch(`${API_BASE}/api/v1/platform/feedback?${params.toString()}`, {
    headers: {
      ...getAuthHeader(),
    },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function updateFeedbackStatus(id: number, statusVal: string, adminNotes?: string): Promise<FeedbackItem> {
  const res = await fetch(`${API_BASE}/api/v1/platform/feedback/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ status: statusVal, admin_notes: adminNotes }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to update feedback status.');
  }
  return res.json();
}

export async function trackEvent(eventName: string, category: 'engagement' | 'analytics' | 'prediction' | 'system' = 'engagement', properties?: Record<string, any>): Promise<void> {
  try {
    const sessionId = getSessionId();
    await fetch(`${API_BASE}/api/v1/platform/events/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: eventName,
        category,
        properties: properties || {},
        session_id: sessionId,
      }),
    });
  } catch {
    // Silently ignore telemetry failure in offline mode
  }
}

export async function fetchProductAnalytics(): Promise<ProductAnalyticsSummary | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/platform/events/summary`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchSystemDiagnostics(): Promise<SystemDiagnostics | null> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/platform/diagnostics`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
