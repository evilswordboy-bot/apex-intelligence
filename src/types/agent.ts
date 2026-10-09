export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface ToolCallStep {
  step: 'Thinking' | 'Selecting tool' | 'Retrieving data' | 'Analysing' | 'Response ready';
  tool_name?: string;
  parameters?: Record<string, any>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration_ms?: number;
}

export interface SourceCitation {
  id: string;
  title: string;
  document_type: string;
  source: string;
  excerpt: string;
  confidence: number;
}

export interface StructuredResultCard {
  card_type: 'match_summary' | 'player_comparison' | 'win_probability' | 'bowler_recommendation' | 'stats_card';
  title: string;
  data: Record<string, any>;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  match_context_id?: string;
  history?: ChatMessage[];
}

export interface ChatResponse {
  conversation_id: string;
  reply: string;
  key_insights: string[];
  tool_calls: ToolCallStep[];
  sources: SourceCitation[];
  structured_card?: StructuredResultCard;
  execution_time_ms: number;
  is_demo_mode: boolean;
  model_provider: string;
}

export interface ToolItem {
  id: string;
  name: string;
  description: string;
  parameters: string[];
}
