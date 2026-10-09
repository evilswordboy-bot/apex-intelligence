from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ChatMessage(BaseModel):
    role: str # 'user' | 'assistant' | 'system'
    content: str
    timestamp: Optional[str] = None

class ToolCallStep(BaseModel):
    step: str # "Thinking" | "Selecting tool" | "Retrieving data" | "Analysing" | "Response ready"
    tool_name: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = None
    status: str = "completed" # "pending" | "running" | "completed" | "failed"
    duration_ms: Optional[int] = 0

class SourceCitation(BaseModel):
    id: str
    title: str
    document_type: str # "Cricsheet Record" | "Match Telemetry" | "Biomechanical Benchmark" | "ML Model Spec"
    source: str
    excerpt: str
    confidence: float = 0.95

class StructuredResultCard(BaseModel):
    card_type: str # "match_summary" | "player_comparison" | "win_probability" | "bowler_recommendation" | "stats_card"
    title: str
    data: Dict[str, Any]

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1500)
    conversation_id: Optional[str] = None
    match_context_id: Optional[str] = "CRI-2026-IND-AUS-WTC"
    history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    conversation_id: str
    reply: str
    key_insights: List[str] = []
    tool_calls: List[ToolCallStep] = []
    sources: List[SourceCitation] = []
    structured_card: Optional[StructuredResultCard] = None
    execution_time_ms: int
    is_demo_mode: bool = False
    model_provider: str # "Gemini-1.5-Pro REST" | "APEX Local Heuristic Intelligence"
