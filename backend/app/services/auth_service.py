"""
APEX Sports Intelligence - Authentication & User Service (Phase 8)
Secure cryptographic password hashing, JWT session token generation,
identity authorization boundaries, user profiles, favorites, and preferences.
"""

import os
import json
import uuid
import hmac
import secrets
import hashlib
from datetime import datetime, timedelta, timezone
from typing import Optional, List, Dict, Any
import jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.database import get_db
from app.models.user_schemas import (
    UserRegisterRequest,
    UserLoginRequest,
    UserResponse,
    AuthTokenResponse,
    UserProfileResponse,
    UserProfileUpdate,
    UserFavoriteItem,
    AddFavoriteRequest,
    DashboardPreferencesResponse,
    DashboardPreferencesUpdate
)

# JWT Configuration
JWT_SECRET = os.getenv("APEX_JWT_SECRET", "apex-sports-ai-cryptographic-token-key-2026-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 48

security = HTTPBearer()

# -------------------------------------------------------------
# 1. Cryptographic Password Hashing (PBKDF2-HMAC-SHA256)
# -------------------------------------------------------------

def hash_password(password: str) -> str:
    """
    Hashes password using PBKDF2 with SHA-256 and 100,000 iterations.
    Never stores plaintext passwords.
    """
    salt = secrets.token_bytes(16)
    pwd_hash = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100_000)
    return f"{salt.hex()}${pwd_hash.hex()}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies plaintext password against stored salted hash in constant time.
    """
    try:
        salt_hex, hash_hex = hashed_password.split("$")
        salt = bytes.fromhex(salt_hex)
        computed = hashlib.pbkdf2_hmac("sha256", plain_password.encode("utf-8"), salt, 100_000)
        return hmac.compare_digest(computed.hex(), hash_hex)
    except Exception:
        return False

# -------------------------------------------------------------
# 2. JWT Access Token Management
# -------------------------------------------------------------

def create_access_token(user_id: str, email: str, display_name: str, hours: int = JWT_EXPIRATION_HOURS) -> str:
    now = datetime.now(timezone.utc)
    expire = now + timedelta(hours=hours)
    payload = {
        "sub": user_id,
        "email": email,
        "name": display_name,
        "exp": expire,
        "iat": now
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_access_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None

# -------------------------------------------------------------
# 3. User & Auth Database Operations
# -------------------------------------------------------------

def register_user(req: UserRegisterRequest) -> AuthTokenResponse:
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Check existing user
        cursor.execute("SELECT id FROM users WHERE email = ?;", (req.email.lower(),))
        if cursor.fetchone():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email address already exists."
            )
            
        user_id = f"usr_{uuid.uuid4().hex[:12]}"
        pwd_hash = hash_password(req.password)
        now_iso = datetime.now(timezone.utc).isoformat()
        
        # Insert user
        cursor.execute("""
        INSERT INTO users (id, email, password_hash, display_name, role, is_verified, created_at, updated_at)
        VALUES (?, ?, ?, ?, 'analyst', 1, ?, ?);
        """, (user_id, req.email.lower(), pwd_hash, req.display_name, now_iso, now_iso))
        
        # Insert initial profile
        cursor.execute("""
        INSERT INTO user_profiles (user_id, time_zone, odds_format, units_system, default_sport, auto_refresh_seconds)
        VALUES (?, 'UTC', 'probability', 'metric', ?, 15);
        """, (user_id, req.favorite_sport or 'all'))
        
        # Insert initial dashboard preferences
        default_widgets = ["live_ticker", "ai_predictions", "radar_benchmarks", "fatigue_guard", "recent_telemetry"]
        cursor.execute("""
        INSERT INTO user_dashboard_preferences (user_id, widget_order, enabled_widgets, saved_views, updated_at)
        VALUES (?, ?, ?, '[]', ?);
        """, (user_id, json.dumps(default_widgets), json.dumps(default_widgets), now_iso))
        
        conn.commit()

    token = create_access_token(user_id, req.email.lower(), req.display_name)
    user_res = UserResponse(
        id=user_id,
        email=req.email.lower(),
        display_name=req.display_name,
        avatar_url=None,
        role="analyst",
        is_verified=True,
        created_at=now_iso
    )
    return AuthTokenResponse(access_token=token, token_type="bearer", user=user_res)

def login_user(req: UserLoginRequest) -> AuthTokenResponse:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, email, password_hash, display_name, avatar_url, role, is_verified, created_at FROM users WHERE email = ?;", (req.email.lower(),))
        row = cursor.fetchone()
        
        if not row or not verify_password(req.password, row["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password credentials."
            )
            
        token = create_access_token(row["id"], row["email"], row["display_name"])
        user_res = UserResponse(
            id=row["id"],
            email=row["email"],
            display_name=row["display_name"],
            avatar_url=row["avatar_url"],
            role=row["role"],
            is_verified=bool(row["is_verified"]),
            created_at=row["created_at"]
        )
        return AuthTokenResponse(access_token=token, token_type="bearer", user=user_res)

def get_user_by_id(user_id: str) -> Optional[UserResponse]:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, email, display_name, avatar_url, role, is_verified, created_at FROM users WHERE id = ?;", (user_id,))
        row = cursor.fetchone()
        if not row:
            return None
        return UserResponse(
            id=row["id"],
            email=row["email"],
            display_name=row["display_name"],
            avatar_url=row["avatar_url"],
            role=row["role"],
            is_verified=bool(row["is_verified"]),
            created_at=row["created_at"]
        )

# -------------------------------------------------------------
# 4. Profile & Preferences (Strict User ID Authorization)
# -------------------------------------------------------------

def get_user_profile(user_id: str) -> UserProfileResponse:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
        SELECT u.id, u.email, u.display_name, u.avatar_url, u.role, u.created_at,
               p.bio, p.time_zone, p.odds_format, p.units_system, p.high_contrast,
               p.auto_refresh_seconds, p.default_sport
        FROM users u
        LEFT JOIN user_profiles p ON u.id = p.user_id
        WHERE u.id = ?;
        """, (user_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="User profile not found.")
            
        return UserProfileResponse(
            user_id=row["id"],
            email=row["email"],
            display_name=row["display_name"],
            avatar_url=row["avatar_url"],
            role=row["role"],
            bio=row["bio"],
            time_zone=row["time_zone"] or "UTC",
            odds_format=row["odds_format"] or "probability",
            units_system=row["units_system"] or "metric",
            high_contrast=bool(row["high_contrast"]),
            auto_refresh_seconds=row["auto_refresh_seconds"] or 15,
            default_sport=row["default_sport"] or "all",
            created_at=row["created_at"]
        )

def update_user_profile(user_id: str, req: UserProfileUpdate) -> UserProfileResponse:
    with get_db() as conn:
        cursor = conn.cursor()
        now_iso = datetime.now(timezone.utc).isoformat()
        
        # Update users table if display_name or avatar_url changed
        if req.display_name is not None or req.avatar_url is not None:
            cursor.execute("""
            UPDATE users SET
                display_name = COALESCE(?, display_name),
                avatar_url = COALESCE(?, avatar_url),
                updated_at = ?
            WHERE id = ?;
            """, (req.display_name, req.avatar_url, now_iso, user_id))
            
        # Update user_profiles table
        cursor.execute("""
        UPDATE user_profiles SET
            bio = COALESCE(?, bio),
            time_zone = COALESCE(?, time_zone),
            odds_format = COALESCE(?, odds_format),
            units_system = COALESCE(?, units_system),
            high_contrast = COALESCE(?, high_contrast),
            auto_refresh_seconds = COALESCE(?, auto_refresh_seconds),
            default_sport = COALESCE(?, default_sport)
        WHERE user_id = ?;
        """, (
            req.bio,
            req.time_zone,
            req.odds_format,
            req.units_system,
            1 if req.high_contrast is True else (0 if req.high_contrast is False else None),
            req.auto_refresh_seconds,
            req.default_sport,
            user_id
        ))
        conn.commit()
        
    return get_user_profile(user_id)

# -------------------------------------------------------------
# 5. User Favorites (Teams, Players, Leagues)
# -------------------------------------------------------------

def get_user_favorites(user_id: str) -> List[UserFavoriteItem]:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
        SELECT id, user_id, item_type, item_id, item_name, sport, created_at
        FROM user_favorites
        WHERE user_id = ?
        ORDER BY id DESC;
        """, (user_id,))
        rows = cursor.fetchall()
        return [
            UserFavoriteItem(
                id=r["id"],
                user_id=r["user_id"],
                item_type=r["item_type"],
                item_id=r["item_id"],
                item_name=r["item_name"],
                sport=r["sport"],
                created_at=r["created_at"]
            )
            for r in rows
        ]

def add_user_favorite(user_id: str, req: AddFavoriteRequest) -> UserFavoriteItem:
    with get_db() as conn:
        cursor = conn.cursor()
        now_iso = datetime.now(timezone.utc).isoformat()
        
        # Check if already favored
        cursor.execute("""
        SELECT id, created_at FROM user_favorites
        WHERE user_id = ? AND item_type = ? AND item_id = ?;
        """, (user_id, req.item_type, req.item_id))
        existing = cursor.fetchone()
        if existing:
            return UserFavoriteItem(
                id=existing["id"],
                user_id=user_id,
                item_type=req.item_type,
                item_id=req.item_id,
                item_name=req.item_name,
                sport=req.sport,
                created_at=existing["created_at"]
            )
            
        cursor.execute("""
        INSERT INTO user_favorites (user_id, item_type, item_id, item_name, sport, created_at)
        VALUES (?, ?, ?, ?, ?, ?);
        """, (user_id, req.item_type, req.item_id, req.item_name, req.sport, now_iso))
        fav_id = cursor.lastrowid
        conn.commit()
        
        return UserFavoriteItem(
            id=fav_id,
            user_id=user_id,
            item_type=req.item_type,
            item_id=req.item_id,
            item_name=req.item_name,
            sport=req.sport,
            created_at=now_iso
        )

def remove_user_favorite(user_id: str, favorite_id: int) -> bool:
    with get_db() as conn:
        cursor = conn.cursor()
        # Strictly verify ownership
        cursor.execute("DELETE FROM user_favorites WHERE id = ? AND user_id = ?;", (favorite_id, user_id))
        conn.commit()
        return cursor.rowcount > 0

# -------------------------------------------------------------
# 6. Dashboard Personalization & Widgets
# -------------------------------------------------------------

def get_dashboard_preferences(user_id: str) -> DashboardPreferencesResponse:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT widget_order, enabled_widgets, saved_views, updated_at FROM user_dashboard_preferences WHERE user_id = ?;", (user_id,))
        row = cursor.fetchone()
        if not row:
            defaults = ["live_ticker", "ai_predictions", "radar_benchmarks", "fatigue_guard", "recent_telemetry"]
            now_iso = datetime.now(timezone.utc).isoformat()
            return DashboardPreferencesResponse(
                user_id=user_id,
                widget_order=defaults,
                enabled_widgets=defaults,
                saved_views=[],
                updated_at=now_iso
            )
        return DashboardPreferencesResponse(
            user_id=user_id,
            widget_order=json.loads(row["widget_order"]),
            enabled_widgets=json.loads(row["enabled_widgets"]),
            saved_views=json.loads(row["saved_views"] or "[]"),
            updated_at=row["updated_at"]
        )

def update_dashboard_preferences(user_id: str, req: DashboardPreferencesUpdate) -> DashboardPreferencesResponse:
    with get_db() as conn:
        cursor = conn.cursor()
        now_iso = datetime.now(timezone.utc).isoformat()
        views_json = json.dumps(req.saved_views) if req.saved_views is not None else "[]"
        cursor.execute("""
        INSERT INTO user_dashboard_preferences (user_id, widget_order, enabled_widgets, saved_views, updated_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
            widget_order = excluded.widget_order,
            enabled_widgets = excluded.enabled_widgets,
            saved_views = excluded.saved_views,
            updated_at = excluded.updated_at;
        """, (user_id, json.dumps(req.widget_order), json.dumps(req.enabled_widgets), views_json, now_iso))
        conn.commit()
    return get_dashboard_preferences(user_id)

# -------------------------------------------------------------
# 7. Password Recovery & Account Deletion
# -------------------------------------------------------------

def create_password_reset(email: str) -> Optional[str]:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE email = ?;", (email.lower(),))
        row = cursor.fetchone()
        if not row:
            return None
        user_id = row["id"]
        token = secrets.token_urlsafe(32)
        expire = (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()
        cursor.execute("INSERT INTO password_resets (user_id, reset_token, expires_at, used) VALUES (?, ?, ?, 0);", (user_id, token, expire))
        conn.commit()
        return token

def reset_password(token: str, new_password: str) -> bool:
    with get_db() as conn:
        cursor = conn.cursor()
        now_iso = datetime.now(timezone.utc).isoformat()
        cursor.execute("SELECT id, user_id, expires_at, used FROM password_resets WHERE reset_token = ?;", (token,))
        row = cursor.fetchone()
        if not row or row["used"] == 1 or row["expires_at"] < now_iso:
            return False
            
        user_id = row["user_id"]
        new_hash = hash_password(new_password)
        cursor.execute("UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?;", (new_hash, now_iso, user_id))
        cursor.execute("UPDATE password_resets SET used = 1 WHERE id = ?;", (row["id"],))
        conn.commit()
        return True

def delete_user_account(user_id: str) -> bool:
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM users WHERE id = ?;", (user_id,))
        conn.commit()
        return cursor.rowcount > 0

# -------------------------------------------------------------
# 8. FastAPI Current User Dependency (Decodes JWT Session)
# -------------------------------------------------------------

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UserResponse:
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has expired or token is invalid. Please sign in again."
        )
    user = get_user_by_id(payload["sub"])
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authenticated user account no longer exists."
        )
    return user
