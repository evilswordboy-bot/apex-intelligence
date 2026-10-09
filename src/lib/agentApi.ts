import { ChatRequest, ChatResponse, ToolItem, SourceCitation } from '@/types/agent';

const API_BASE = '/api/agent';

export async function sendAgentMessage(payload: ChatRequest): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Chat request failed: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchAgentTools(): Promise<{ tools: ToolItem[] }> {
  const res = await fetch(`${API_BASE}/tools`);
  if (!res.ok) throw new Error(`Failed to fetch agent tools: ${res.statusText}`);
  return res.json();
}

export async function fetchKnowledgeSources(query: string = 'cricket'): Promise<SourceCitation[]> {
  const res = await fetch(`${API_BASE}/sources?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`Failed to fetch sources: ${res.statusText}`);
  return res.json();
}

export async function fetchSuggestedPrompts(): Promise<{ suggested_prompts: string[] }> {
  const res = await fetch(`${API_BASE}/conversations`);
  if (!res.ok) throw new Error(`Failed to fetch suggested prompts: ${res.statusText}`);
  return res.json();
}
