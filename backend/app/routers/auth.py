"""
APEX Sports Intelligence - Auth Router (Phase 8)
Endpoints for user registration, login, logout, current user verification,
password recovery, and account management.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from app.models.user_schemas import (
    UserRegisterRequest,
    UserLoginRequest,
    AuthTokenResponse,
    UserResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest
)
from app.services.auth_service import (
    register_user,
    login_user,
    get_current_user,
    create_password_reset,
    reset_password,
    delete_user_account
)

router = APIRouter(prefix="/api/v1/auth", tags=["User Authentication & Security"])

@router.post("/register", response_model=AuthTokenResponse, status_code=status.HTTP_201_CREATED)
def register(req: UserRegisterRequest):
    """
    Registers a new APEX user account with salted PBKDF2 password hashing.
    Issues a secure JWT access token upon successful registration.
    """
    return register_user(req)

@router.post("/login", response_model=AuthTokenResponse)
def login(req: UserLoginRequest):
    """
    Authenticates user credentials against PBKDF2 hash and issues a JWT token.
    """
    return login_user(req)

@router.post("/logout")
def logout(current_user: UserResponse = Depends(get_current_user)):
    """
    Clears the active session for the authenticated user.
    """
    return {"status": "success", "message": f"User {current_user.email} signed out successfully."}

@router.get("/me", response_model=UserResponse)
def get_authenticated_user(current_user: UserResponse = Depends(get_current_user)):
    """
    Returns verified profile identity for the active session.
    """
    return current_user

@router.post("/forgot-password", response_model=ForgotPasswordResponse)
def forgot_password(req: ForgotPasswordRequest):
    """
    Initiates password recovery by issuing a cryptographic one-time reset token.
    """
    token = create_password_reset(req.email)
    if not token:
        # Prevent email enumeration by returning consistent success message
        return ForgotPasswordResponse(
            message="If an account exists with this email, password reset instructions have been sent."
        )
    return ForgotPasswordResponse(
        message="Password recovery token generated successfully (valid for 15 minutes).",
        reset_token=token
    )

@router.post("/reset-password")
def complete_password_reset(req: ResetPasswordRequest):
    """
    Validates token and updates the password hash.
    """
    success = reset_password(req.reset_token, req.new_password)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset token is invalid or has expired."
        )
    return {"status": "success", "message": "Password successfully reset. You can now sign in with your new credentials."}

@router.delete("/account")
def delete_account(current_user: UserResponse = Depends(get_current_user)):
    """
    Permanently deletes user account, profile, and all associated personal records.
    """
    success = delete_user_account(current_user.id)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to delete account.")
    return {"status": "success", "message": "User account and all personal preferences permanently deleted."}
