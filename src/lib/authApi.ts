import {
  User,
  AuthTokenResponse,
  UserProfile,
  UserProfileUpdate,
  UserFavoriteItem,
  AddFavoriteRequest,
  DashboardPreferences,
  DashboardPreferencesUpdate
} from '@/types/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
const TOKEN_KEY = 'apex_jwt_token';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

function getAuthHeaders(): HeadersInit {
  const token = getStoredToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function registerUser(
  email: string,
  password: string,
  displayName: string,
  favoriteSport: string = 'all'
): Promise<AuthTokenResponse> {
  const res = await fetch(`${API_BASE}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      display_name: displayName,
      favorite_sport: favoriteSport
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Registration failed' }));
    throw new Error(err.detail || 'Registration failed');
  }
  const data: AuthTokenResponse = await res.json();
  setStoredToken(data.access_token);
  return data;
}

export async function loginUser(email: string, password: string): Promise<AuthTokenResponse> {
  const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Invalid credentials' }));
    throw new Error(err.detail || 'Invalid credentials');
  }
  const data: AuthTokenResponse = await res.json();
  setStoredToken(data.access_token);
  return data;
}

export async function logoutUser(): Promise<void> {
  try {
    await fetch(`${API_BASE}/api/v1/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
  } catch (err) {
    console.warn('Logout API failed:', err);
  } finally {
    setStoredToken(null);
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const token = getStoredToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE}/api/v1/auth/me`, {
      headers: getAuthHeaders(),
      cache: 'no-store'
    });
    if (res.ok) {
      return await res.json();
    }
    if (res.status === 401) {
      setStoredToken(null);
    }
  } catch (err) {
    console.warn('Failed to fetch authenticated user:', err);
  }
  return null;
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const token = getStoredToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE}/api/v1/users/profile`, {
      headers: getAuthHeaders(),
      cache: 'no-store'
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Failed to fetch user profile:', err);
  }
  return null;
}

export async function updateUserProfile(update: UserProfileUpdate): Promise<UserProfile> {
  const res = await fetch(`${API_BASE}/api/v1/users/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(update)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to update profile' }));
    throw new Error(err.detail || 'Failed to update profile');
  }
  return await res.json();
}

export async function getUserFavorites(): Promise<UserFavoriteItem[]> {
  const token = getStoredToken();
  if (!token) return [];
  try {
    const res = await fetch(`${API_BASE}/api/v1/users/favorites`, {
      headers: getAuthHeaders(),
      cache: 'no-store'
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Failed to fetch favorites:', err);
  }
  return [];
}

export async function addUserFavorite(item: AddFavoriteRequest): Promise<UserFavoriteItem> {
  const res = await fetch(`${API_BASE}/api/v1/users/favorites`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(item)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to add favorite' }));
    throw new Error(err.detail || 'Failed to add favorite');
  }
  return await res.json();
}

export async function removeUserFavorite(favoriteId: number): Promise<boolean> {
  const res = await fetch(`${API_BASE}/api/v1/users/favorites/${favoriteId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  return res.ok;
}

export async function getDashboardPreferences(): Promise<DashboardPreferences | null> {
  const token = getStoredToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE}/api/v1/users/dashboard`, {
      headers: getAuthHeaders(),
      cache: 'no-store'
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Failed to fetch dashboard preferences:', err);
  }
  return null;
}

export async function updateDashboardPreferences(
  update: DashboardPreferencesUpdate
): Promise<DashboardPreferences> {
  const res = await fetch(`${API_BASE}/api/v1/users/dashboard`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(update)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to update dashboard preferences' }));
    throw new Error(err.detail || 'Failed to update dashboard preferences');
  }
  return await res.json();
}

export async function forgotPassword(email: string): Promise<{ message: string; reset_token?: string }> {
  const res = await fetch(`${API_BASE}/api/v1/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return await res.json();
}

export async function resetPassword(resetToken: string, newPassword: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/api/v1/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reset_token: resetToken, new_password: newPassword })
  });
  return res.ok;
}

export async function deleteUserAccount(): Promise<boolean> {
  const res = await fetch(`${API_BASE}/api/v1/auth/account`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (res.ok) {
    setStoredToken(null);
  }
  return res.ok;
}
