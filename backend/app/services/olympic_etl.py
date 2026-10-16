"""
APEX AI — Olympic Games Dataset ETL & Normalization Pipeline
Ingests: Athletes, Coaches, EntriesGender, Medals, Teams from Excel.
Normalizes, cleans, computes derived metrics, and populates SQLite tables with FTS5 search index.
"""
import os
import sqlite3
import pandas as pd
from pathlib import Path
from typing import Dict, Any

OLYMPICS_DIR = Path(__file__).resolve().parent.parent.parent / "data" / "olympics"
DB_PATH = Path(__file__).resolve().parent.parent.parent / "data" / "cricket.db"

def run_olympics_etl(force_reload: bool = False) -> Dict[str, Any]:
    """Ingests and validates Olympic datasets into SQLite database."""
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 1. Create Tables
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS olympic_athletes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        noc TEXT NOT NULL,
        discipline TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS olympic_coaches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        noc TEXT NOT NULL,
        discipline TEXT NOT NULL,
        event TEXT
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS olympic_gender_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        discipline TEXT UNIQUE NOT NULL,
        female INTEGER NOT NULL,
        male INTEGER NOT NULL,
        total INTEGER NOT NULL,
        female_ratio REAL NOT NULL,
        male_ratio REAL NOT NULL,
        gender_parity_gap REAL NOT NULL,
        parity_category TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS olympic_medals (
        rank INTEGER NOT NULL,
        noc TEXT PRIMARY KEY,
        gold INTEGER NOT NULL,
        silver INTEGER NOT NULL,
        bronze INTEGER NOT NULL,
        total INTEGER NOT NULL,
        rank_by_total INTEGER NOT NULL,
        gold_ratio REAL NOT NULL,
        weighted_score INTEGER NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS olympic_teams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        discipline TEXT NOT NULL,
        noc TEXT NOT NULL,
        event TEXT NOT NULL
    );
    """)

    # Check if already populated
    cursor.execute("SELECT COUNT(*) FROM olympic_athletes")
    ath_count = cursor.fetchone()[0]

    if ath_count > 0 and not force_reload:
        cursor.execute("SELECT COUNT(*) FROM olympic_coaches")
        coaches_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM olympic_gender_entries")
        gender_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM olympic_medals")
        medals_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM olympic_teams")
        teams_count = cursor.fetchone()[0]
        conn.close()
        return {
            "status": "already_loaded",
            "athletes": ath_count,
            "coaches": coaches_count,
            "gender_entries": gender_count,
            "medals": medals_count,
            "teams": teams_count
        }

    # Clear existing if force_reload
    cursor.execute("DELETE FROM olympic_athletes")
    cursor.execute("DELETE FROM olympic_coaches")
    cursor.execute("DELETE FROM olympic_gender_entries")
    cursor.execute("DELETE FROM olympic_medals")
    cursor.execute("DELETE FROM olympic_teams")

    # Ingest Athletes
    ath_path = OLYMPICS_DIR / "Athletes.xlsx"
    df_ath = pd.read_excel(ath_path)
    df_ath["Name"] = df_ath["Name"].astype(str).str.strip()
    df_ath["NOC"] = df_ath["NOC"].astype(str).str.strip()
    df_ath["Discipline"] = df_ath["Discipline"].astype(str).str.strip()

    athletes_data = [
        (row["Name"], row["NOC"], row["Discipline"])
        for _, row in df_ath.iterrows()
    ]
    cursor.executemany(
        "INSERT INTO olympic_athletes (name, noc, discipline) VALUES (?, ?, ?)",
        athletes_data
    )

    # Ingest Coaches
    coach_path = OLYMPICS_DIR / "Coaches.xlsx"
    df_coach = pd.read_excel(coach_path)
    df_coach["Name"] = df_coach["Name"].astype(str).str.strip()
    df_coach["NOC"] = df_coach["NOC"].astype(str).str.strip()
    df_coach["Discipline"] = df_coach["Discipline"].astype(str).str.strip()
    df_coach["Event"] = df_coach["Event"].apply(lambda x: str(x).strip() if pd.notnull(x) else None)

    coaches_data = [
        (row["Name"], row["NOC"], row["Discipline"], row["Event"])
        for _, row in df_coach.iterrows()
    ]
    cursor.executemany(
        "INSERT INTO olympic_coaches (name, noc, discipline, event) VALUES (?, ?, ?, ?)",
        coaches_data
    )

    # Ingest Gender Entries
    gender_path = OLYMPICS_DIR / "EntriesGender.xlsx"
    df_gender = pd.read_excel(gender_path)
    df_gender["Discipline"] = df_gender["Discipline"].astype(str).str.strip()
    df_gender["Female"] = pd.to_numeric(df_gender["Female"], errors="coerce").fillna(0).astype(int)
    df_gender["Male"] = pd.to_numeric(df_gender["Male"], errors="coerce").fillna(0).astype(int)
    df_gender["Total"] = pd.to_numeric(df_gender["Total"], errors="coerce").fillna(0).astype(int)

    gender_data = []
    for _, row in df_gender.iterrows():
        f = int(row["Female"])
        m = int(row["Male"])
        tot = int(row["Total"]) if int(row["Total"]) > 0 else (f + m)
        f_ratio = round(f / tot, 4) if tot > 0 else 0.5
        m_ratio = round(m / tot, 4) if tot > 0 else 0.5
        gap = round(abs(f - m) / tot, 4) if tot > 0 else 0.0
        if f_ratio > 0.55:
            cat = "Female Dominated"
        elif f_ratio < 0.45:
            cat = "Male Dominated"
        else:
            cat = "Gender Balanced"
        gender_data.append((row["Discipline"], f, m, tot, f_ratio, m_ratio, gap, cat))

    cursor.executemany(
        "INSERT INTO olympic_gender_entries (discipline, female, male, total, female_ratio, male_ratio, gender_parity_gap, parity_category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        gender_data
    )

    # Ingest Medals
    med_path = OLYMPICS_DIR / "Medals.xlsx"
    df_med = pd.read_excel(med_path)
    df_med["Team/NOC"] = df_med["Team/NOC"].astype(str).str.strip()
    df_med["Rank"] = pd.to_numeric(df_med["Rank"], errors="coerce").fillna(0).astype(int)
    df_med["Gold"] = pd.to_numeric(df_med["Gold"], errors="coerce").fillna(0).astype(int)
    df_med["Silver"] = pd.to_numeric(df_med["Silver"], errors="coerce").fillna(0).astype(int)
    df_med["Bronze"] = pd.to_numeric(df_med["Bronze"], errors="coerce").fillna(0).astype(int)
    df_med["Total"] = pd.to_numeric(df_med["Total"], errors="coerce").fillna(0).astype(int)
    df_med["Rank by Total"] = pd.to_numeric(df_med["Rank by Total"], errors="coerce").fillna(0).astype(int)

    medals_data = []
    for _, row in df_med.iterrows():
        g, s, b, tot = int(row["Gold"]), int(row["Silver"]), int(row["Bronze"]), int(row["Total"])
        g_ratio = round(g / tot, 4) if tot > 0 else 0.0
        weighted = (g * 3) + (s * 2) + (b * 1)
        medals_data.append((int(row["Rank"]), row["Team/NOC"], g, s, b, tot, int(row["Rank by Total"]), g_ratio, weighted))

    cursor.executemany(
        "INSERT INTO olympic_medals (rank, noc, gold, silver, bronze, total, rank_by_total, gold_ratio, weighted_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        medals_data
    )

    # Ingest Teams
    teams_path = OLYMPICS_DIR / "Teams.xlsx"
    df_teams = pd.read_excel(teams_path)
    df_teams["Name"] = df_teams["Name"].astype(str).str.strip()
    df_teams["Discipline"] = df_teams["Discipline"].astype(str).str.strip()
    df_teams["NOC"] = df_teams["NOC"].astype(str).str.strip()
    df_teams["Event"] = df_teams["Event"].astype(str).str.strip()

    teams_data = [
        (row["Name"], row["Discipline"], row["NOC"], row["Event"])
        for _, row in df_teams.iterrows()
    ]
    cursor.executemany(
        "INSERT INTO olympic_teams (name, discipline, noc, event) VALUES (?, ?, ?, ?)",
        teams_data
    )

    # Create Indexes
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_olympic_ath_name ON olympic_athletes(name);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_olympic_ath_noc ON olympic_athletes(noc);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_olympic_ath_disc ON olympic_athletes(discipline);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_olympic_coach_noc ON olympic_coaches(noc);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_olympic_coach_disc ON olympic_coaches(discipline);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_olympic_teams_noc ON olympic_teams(noc);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_olympic_teams_disc ON olympic_teams(discipline);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_olympic_med_rank ON olympic_medals(rank);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_olympic_med_gold ON olympic_medals(gold DESC);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_olympic_med_total ON olympic_medals(total DESC);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_olympic_med_weighted ON olympic_medals(weighted_score DESC);")

    # Full-Text Search FTS5 Virtual Table
    cursor.execute("DROP TABLE IF EXISTS olympic_search_fts;")
    cursor.execute("""
    CREATE VIRTUAL TABLE olympic_search_fts USING fts5(
        entity_type,
        entity_id,
        name,
        noc,
        discipline,
        event
    );
    """)

    # Populate FTS
    cursor.execute("""
    INSERT INTO olympic_search_fts (entity_type, entity_id, name, noc, discipline, event)
    SELECT 'athlete', id, name, noc, discipline, '' FROM olympic_athletes;
    """)

    cursor.execute("""
    INSERT INTO olympic_search_fts (entity_type, entity_id, name, noc, discipline, event)
    SELECT 'coach', id, name, noc, discipline, COALESCE(event, '') FROM olympic_coaches;
    """)

    cursor.execute("""
    INSERT INTO olympic_search_fts (entity_type, entity_id, name, noc, discipline, event)
    SELECT 'team', id, name, noc, discipline, event FROM olympic_teams;
    """)

    cursor.execute("""
    INSERT INTO olympic_search_fts (entity_type, entity_id, name, noc, discipline, event)
    SELECT 'country', rank, noc, noc, 'Medal Winning NOC', '' FROM olympic_medals;
    """)

    conn.commit()
    conn.close()

    return {
        "status": "success",
        "athletes_ingested": len(athletes_data),
        "coaches_ingested": len(coaches_data),
        "gender_disciplines_ingested": len(gender_data),
        "medals_ingested": len(medals_data),
        "teams_ingested": len(teams_data)
    }

if __name__ == "__main__":
    result = run_olympics_etl(force_reload=True)
    print("ETL Result:", result)
