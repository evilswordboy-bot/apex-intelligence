"""
APEX Sports Intelligence — Phase 10 Schemas
Pydantic models for user feedback, bug reporting, product analytics events,
system telemetry monitoring, and administrative review.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class FeedbackCreateRequest(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    email: Optional[str] = Field(None, max_length=120)
    category: str = Field("suggestion", description="'bug', 'suggestion', 'feature_request', 'general'")
    rating: Optional[int] = Field(5, ge=1, le=5)
    title: str = Field(..., min_length=3, max_length=150)
    message: str = Field(..., min_length=10, max_length=2000)

class FeedbackItemResponse(BaseModel):
    id: int
    user_id: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None
    category: str
    rating: Optional[int] = None
    title: str
    message: str
    status: str # 'new', 'reviewed', 'resolved'
    admin_notes: Optional[str] = None
    created_at: str

class FeedbackUpdateRequest(BaseModel):
    status: str = Field(..., description="'new', 'reviewed', 'resolved'")
    admin_notes: Optional[str] = None

class ProductEventTrackRequest(BaseModel):
    event_name: str = Field(..., min_length=2, max_length=80)
    category: str = Field("engagement", description="'engagement', 'analytics', 'prediction', 'system'")
    properties: Optional[Dict[str, Any]] = None
    session_id: Optional[str] = None

class ProductAnalyticsSummary(BaseModel):
    total_events: int
    unique_sessions: int
    top_events: List[Dict[str, Any]]
    events_by_category: Dict[str, int]
    recent_activity: List[Dict[str, Any]]

class SystemHealthDiagnostics(BaseModel):
    status: str
    version: str
    uptime_seconds: float
    database: Dict[str, Any]
    memory_rss_mb: float
    active_endpoints: int
    prediction_models: Dict[str, str]
    live_relay_status: str
    security_headers_enabled: bool
