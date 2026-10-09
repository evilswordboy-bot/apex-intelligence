"""
APEX Sports Intelligence - User & Auth Schemas (Phase 8)
Pydantic schemas for secure user authentication, profiles, favorites,
dashboard customization, and password recovery.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class UserRegisterRequest(BaseModel):
    email: str = Field(..., description="User email address")
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")
    display_name: str = Field(..., min_length=2, max_length=50)
    favorite_sport: Optional[str] = Field("all", description="Initial preferred sport")

class UserLoginRequest(BaseModel):
    email: str = Field(..., description="User email address")
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    display_name: str
    avatar_url: Optional[str] = None
    role: str = "analyst"
    is_verified: bool = True
    created_at: str

class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class UserProfileResponse(BaseModel):
    user_id: str
    email: str
    display_name: str
    avatar_url: Optional[str] = None
    role: str
    bio: Optional[str] = None
    time_zone: str = "UTC"
    odds_format: str = "probability" # "probability" | "decimal" | "american"
    units_system: str = "metric" # "metric" | "imperial"
    high_contrast: bool = False
    auto_refresh_seconds: int = 15
    default_sport: str = "all"
    created_at: str

class UserProfileUpdate(BaseModel):
    display_name: Optional[str] = Field(None, min_length=2, max_length=50)
    avatar_url: Optional[str] = None
    bio: Optional[str] = Field(None, max_length=300)
    time_zone: Optional[str] = None
    odds_format: Optional[str] = None
    units_system: Optional[str] = None
    high_contrast: Optional[bool] = None
    auto_refresh_seconds: Optional[int] = Field(None, ge=5, le=120)
    default_sport: Optional[str] = None

class UserFavoriteItem(BaseModel):
    id: int
    user_id: str
    item_type: str # 'team' | 'player' | 'league'
    item_id: str
    item_name: str
    sport: str
    created_at: str

class AddFavoriteRequest(BaseModel):
    item_type: str = Field(..., description="'team', 'player', or 'league'")
    item_id: str
    item_name: str
    sport: str

class DashboardPreferencesResponse(BaseModel):
    user_id: str
    widget_order: List[str]
    enabled_widgets: List[str]
    saved_views: List[Dict[str, Any]]
    updated_at: str

class DashboardPreferencesUpdate(BaseModel):
    widget_order: List[str]
    enabled_widgets: List[str]
    saved_views: Optional[List[Dict[str, Any]]] = None

class ForgotPasswordRequest(BaseModel):
    email: str = Field(..., description="User email address")

class ForgotPasswordResponse(BaseModel):
    message: str
    reset_token: Optional[str] = None # Returned for development / demo recovery

class ResetPasswordRequest(BaseModel):
    reset_token: str
    new_password: str = Field(..., min_length=8)
