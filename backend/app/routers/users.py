"""
APEX Sports Intelligence - Users Router (Phase 8)
Secure endpoints for user profiles, favorite teams/players,
and personalized dashboard configurations.
Authorization strictly derives identity from verified JWT session.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Path
from typing import List
from app.models.user_schemas import (
    UserResponse,
    UserProfileResponse,
    UserProfileUpdate,
    UserFavoriteItem,
    AddFavoriteRequest,
    DashboardPreferencesResponse,
    DashboardPreferencesUpdate
)
from app.services.auth_service import (
    get_current_user,
    get_user_profile,
    update_user_profile,
    get_user_favorites,
    add_user_favorite,
    remove_user_favorite,
    get_dashboard_preferences,
    update_dashboard_preferences
)

router = APIRouter(prefix="/api/v1/users", tags=["User Profiles & Personalization"])

# -------------------------------------------------------------
# 1. Profile Management
# -------------------------------------------------------------

@router.get("/profile", response_model=UserProfileResponse)
def get_profile(current_user: UserResponse = Depends(get_current_user)):
    """
    Retrieves the complete profile and personal preferences for the authenticated user.
    """
    return get_user_profile(current_user.id)

@router.put("/profile", response_model=UserProfileResponse)
def update_profile(
    req: UserProfileUpdate,
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Updates profile fields (display name, bio, time zone, display units, odds format, high contrast).
    """
    return update_user_profile(current_user.id, req)

# -------------------------------------------------------------
# 2. Favorites Management
# -------------------------------------------------------------

@router.get("/favorites", response_model=List[UserFavoriteItem])
def list_favorites(current_user: UserResponse = Depends(get_current_user)):
    """
    Returns saved teams, players, and competitions for the authenticated user.
    """
    return get_user_favorites(current_user.id)

@router.post("/favorites", response_model=UserFavoriteItem, status_code=status.HTTP_201_CREATED)
def add_favorite(
    req: AddFavoriteRequest,
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Adds a team, player, or league to the authenticated user's favorites.
    """
    return add_user_favorite(current_user.id, req)

@router.delete("/favorites/{favorite_id}")
def delete_favorite(
    favorite_id: int = Path(..., description="ID of the favorite record to delete"),
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Removes an item from favorites. Strictly checks ownership against authenticated user.
    """
    deleted = remove_user_favorite(current_user.id, favorite_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favorite item not found or unauthorized to delete."
        )
    return {"status": "success", "message": "Favorite item removed."}

# -------------------------------------------------------------
# 3. Personalized Dashboard Layout & Widget Preferences
# -------------------------------------------------------------

@router.get("/dashboard", response_model=DashboardPreferencesResponse)
def get_dashboard_layout(current_user: UserResponse = Depends(get_current_user)):
    """
    Returns saved dashboard layout (widget order and enabled widgets) for the authenticated user.
    """
    return get_dashboard_preferences(current_user.id)

@router.put("/dashboard", response_model=DashboardPreferencesResponse)
def update_dashboard_layout(
    req: DashboardPreferencesUpdate,
    current_user: UserResponse = Depends(get_current_user)
):
    """
    Saves personalized dashboard widget ordering, toggled widgets, and custom views.
    """
    return update_dashboard_preferences(current_user.id, req)
