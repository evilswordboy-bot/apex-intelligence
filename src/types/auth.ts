export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string | null;
  role: string;
  is_verified: boolean;
  created_at: string;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface UserProfile {
  user_id: string;
  email: string;
  display_name: string;
  avatar_url?: string | null;
  role: string;
  bio?: string | null;
  time_zone: string;
  odds_format: string; // 'probability' | 'decimal' | 'american'
  units_system: string; // 'metric' | 'imperial'
  high_contrast: boolean;
  auto_refresh_seconds: number;
  default_sport: string;
  created_at: string;
}

export interface UserProfileUpdate {
  display_name?: string;
  avatar_url?: string | null;
  bio?: string;
  time_zone?: string;
  odds_format?: string;
  units_system?: string;
  high_contrast?: boolean;
  auto_refresh_seconds?: number;
  default_sport?: string;
}

export interface UserFavoriteItem {
  id: number;
  user_id: string;
  item_type: 'team' | 'player' | 'league' | string;
  item_id: string;
  item_name: string;
  sport: string;
  created_at: string;
}

export interface AddFavoriteRequest {
  item_type: 'team' | 'player' | 'league' | string;
  item_id: string;
  item_name: string;
  sport: string;
}

export interface DashboardPreferences {
  user_id: string;
  widget_order: string[];
  enabled_widgets: string[];
  saved_views: any[];
  updated_at: string;
}

export interface DashboardPreferencesUpdate {
  widget_order: string[];
  enabled_widgets: string[];
  saved_views?: any[];
}
