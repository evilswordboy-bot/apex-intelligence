import sqlite3
import os
from pathlib import Path
from contextlib import contextmanager

DB_DIR = Path(__file__).resolve().parent.parent / "data"
DB_PATH = DB_DIR / "cricket.db"

def get_db_path() -> Path:
    DB_DIR.mkdir(parents=True, exist_ok=True)
    return DB_PATH

@contextmanager
def get_db():
    conn = sqlite3.connect(get_db_path())
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    """Initializes the database schema if tables do not exist."""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Matches table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS matches (
            id TEXT PRIMARY KEY,
            competition TEXT NOT NULL,
            match_type TEXT NOT NULL, -- T20, ODI, Test
            season TEXT NOT NULL,
            match_date TEXT NOT NULL,
            venue TEXT NOT NULL,
            team1 TEXT NOT NULL,
            team2 TEXT NOT NULL,
            toss_winner TEXT NOT NULL,
            toss_decision TEXT NOT NULL,
            winner TEXT,
            win_margin TEXT,
            target_runs INTEGER,
            is_demo INTEGER DEFAULT 0 -- 1 if synthetic demonstration, 0 if imported Cricsheet
        );
        """)
        
        # Innings table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS innings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            match_id TEXT NOT NULL,
            innings_num INTEGER NOT NULL,
            batting_team TEXT NOT NULL,
            bowling_team TEXT NOT NULL,
            total_runs INTEGER DEFAULT 0,
            total_wickets INTEGER DEFAULT 0,
            total_overs REAL DEFAULT 0.0,
            FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
            UNIQUE(match_id, innings_num)
        );
        """)

        # Deliveries table (ball-by-ball)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS deliveries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            match_id TEXT NOT NULL,
            innings_num INTEGER NOT NULL,
            over INTEGER NOT NULL,
            ball INTEGER NOT NULL,
            batter TEXT NOT NULL,
            non_striker TEXT NOT NULL,
            bowler TEXT NOT NULL,
            runs_batter INTEGER NOT NULL DEFAULT 0,
            runs_extras INTEGER NOT NULL DEFAULT 0,
            runs_total INTEGER NOT NULL DEFAULT 0,
            is_wicket INTEGER NOT NULL DEFAULT 0,
            dismissal_kind TEXT,
            dismissed_player TEXT,
            shot_zone TEXT, -- Fine Leg, Square Leg, Mid-Wicket, Long-On, Long-Off, Extra Cover, Point, Third Man
            shot_angle REAL, -- 0-360 degrees
            shot_distance REAL, -- meters
            is_simulated INTEGER DEFAULT 0, -- 1 if illustrative/interpolated, 0 if recorded
            FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE
        );
        """)

        # Player attributes table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS players (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            country TEXT NOT NULL,
            role TEXT NOT NULL, -- Batter, Fast Bowler, Spin Bowler, All-Rounder, Wicketkeeper
            batting_style TEXT,
            bowling_style TEXT,
            strike_rate REAL,
            average REAL,
            economy REAL
        );
        """)

        # Indexes for fast querying
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_deliv_match ON deliveries(match_id, innings_num);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_deliv_matchup ON deliveries(batter, bowler);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_deliv_over ON deliveries(match_id, innings_num, over);")

        # =========================================================
        # PHASE 8: User Accounts, Profiles & Personalization Schema
        # =========================================================

        # 1. Users Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            display_name TEXT NOT NULL,
            avatar_url TEXT,
            role TEXT DEFAULT 'analyst',
            is_verified INTEGER DEFAULT 1,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );
        """)

        # 2. User Profiles Table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_profiles (
            user_id TEXT PRIMARY KEY,
            bio TEXT,
            time_zone TEXT DEFAULT 'UTC',
            odds_format TEXT DEFAULT 'probability',
            units_system TEXT DEFAULT 'metric',
            high_contrast INTEGER DEFAULT 0,
            auto_refresh_seconds INTEGER DEFAULT 15,
            default_sport TEXT DEFAULT 'all',
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        """)

        # 3. User Favorites (Teams, Players, Competitions)
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_favorites (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            item_type TEXT NOT NULL, -- 'team', 'player', 'league'
            item_id TEXT NOT NULL,
            item_name TEXT NOT NULL,
            sport TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE(user_id, item_type, item_id)
        );
        """)

        # 4. User Dashboard Preferences & Widget Layouts
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_dashboard_preferences (
            user_id TEXT PRIMARY KEY,
            widget_order TEXT NOT NULL, -- JSON array of widget keys
            enabled_widgets TEXT NOT NULL, -- JSON array of active widget keys
            saved_views TEXT, -- JSON array of saved filters
            updated_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        """)

        # 5. Password Reset Tokens
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS password_resets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            reset_token TEXT UNIQUE NOT NULL,
            expires_at TEXT NOT NULL,
            used INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        """)

        # 6. Phase 10: User Feedback & Bug Reports
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT, -- nullable for guest feedback
            name TEXT,
            email TEXT,
            category TEXT NOT NULL, -- 'bug', 'suggestion', 'feature_request', 'general'
            rating INTEGER, -- 1-5 stars
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            status TEXT DEFAULT 'new', -- 'new', 'reviewed', 'resolved'
            admin_notes TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        );
        """)

        # 7. Phase 10: Privacy-Conscious Product Analytics Events
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS product_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            event_name TEXT NOT NULL, -- 'page_view', 'registration', 'prediction_run', 'csv_export', 'model_sandbox'
            category TEXT NOT NULL, -- 'engagement', 'analytics', 'prediction', 'system'
            properties TEXT, -- JSON string of non-PII properties
            session_id TEXT,
            created_at TEXT NOT NULL
        );
        """)

        # Phase 8 & Phase 10 Indexes
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_fav_user ON user_favorites(user_id);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_pwd_resets_token ON password_resets(reset_token);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_feedback_status ON user_feedback(status);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_events_name ON product_events(event_name);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_events_created ON product_events(created_at);")
        
        conn.commit()

if __name__ == "__main__":
    init_db()
    print(f"Database initialized at {get_db_path()}")
