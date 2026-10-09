"""
Cricsheet Data Importer for APEX Cricket Intelligence Lab
Parses Cricsheet ball-by-ball JSON format into the normalized SQLite database schema.
Supports official Cricsheet match files (JSON format v1.0.0+).
"""

import json
import os
import sys
from pathlib import Path
from typing import Dict, Any, Optional

backend_dir = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(backend_dir))

from app.database import get_db, init_db

def import_cricsheet_json(file_path: str) -> Optional[str]:
    """
    Imports a single Cricsheet match JSON file into SQLite.
    Returns match_id on success, or None on failure.
    """
    init_db()
    path = Path(file_path)
    if not path.exists():
        print(f"Error: File not found at {file_path}")
        return None

    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        print(f"Failed to read or parse JSON: {e}")
        return None

    info = data.get("info", {})
    match_type = info.get("match_type", "T20").upper()
    dates = info.get("dates", ["2026-01-01"])
    match_date = dates[0] if dates else "2026-01-01"
    season = str(info.get("season", "2026"))
    venue = info.get("venue", "International Stadium")
    teams = info.get("teams", ["Team A", "Team B"])
    team1 = teams[0] if len(teams) > 0 else "Team 1"
    team2 = teams[1] if len(teams) > 1 else "Team 2"
    
    toss = info.get("toss", {})
    toss_winner = toss.get("winner", team1)
    toss_decision = toss.get("decision", "bat")
    
    outcome = info.get("outcome", {})
    winner = outcome.get("winner")
    win_margin = None
    if "by" in outcome:
        if "runs" in outcome["by"]:
            win_margin = f"{outcome['by']['runs']} runs"
        elif "wickets" in outcome["by"]:
            win_margin = f"{outcome['by']['wickets']} wickets"

    event_info = info.get("event", {})
    competition = event_info.get("name", "Cricket International")
    
    match_id = path.stem
    if not match_id.startswith("CRI-"):
        match_id = f"CRI-IMP-{match_id}"

    with get_db() as conn:
        cursor = conn.cursor()
        
        # Insert Match
        cursor.execute("""
        INSERT OR REPLACE INTO matches (
            id, competition, match_type, season, match_date, venue, team1, team2,
            toss_winner, toss_decision, winner, win_margin, target_runs, is_demo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0);
        """, (match_id, competition, match_type, season, match_date, venue, team1, team2, toss_winner, toss_decision, winner, win_margin, None))

        # Ingest Innings & Deliveries
        innings_list = data.get("innings", [])
        for idx, inn in enumerate(innings_list, start=1):
            batting_team = inn.get("team", team1 if idx == 1 else team2)
            bowling_team = team2 if batting_team == team1 else team1
            
            overs_data = inn.get("overs", [])
            total_runs = 0
            total_wickets = 0
            total_overs = len(overs_data)
            
            deliveries_to_insert = []
            
            for over_obj in overs_data:
                over_num = over_obj.get("over", 0) + 1 # 1-indexed over
                for b_idx, delivery in enumerate(over_obj.get("deliveries", []), start=1):
                    batter = delivery.get("batter", "Unknown Batter")
                    non_striker = delivery.get("non_striker", "Unknown")
                    bowler = delivery.get("bowler", "Unknown Bowler")
                    
                    runs_info = delivery.get("runs", {})
                    runs_batter = runs_info.get("batter", 0)
                    runs_extras = runs_info.get("extras", 0)
                    runs_total = runs_info.get("total", runs_batter + runs_extras)
                    
                    is_wicket = 1 if "wickets" in delivery else 0
                    dismissal_kind = None
                    dismissed_player = None
                    if is_wicket:
                        w_list = delivery.get("wickets", [])
                        if w_list:
                            dismissal_kind = w_list[0].get("kind")
                            dismissed_player = w_list[0].get("player_out", batter)
                            total_wickets += 1
                            
                    total_runs += runs_total
                    
                    deliveries_to_insert.append((
                        match_id, idx, over_num, b_idx, batter, non_striker, bowler,
                        runs_batter, runs_extras, runs_total, is_wicket,
                        dismissal_kind, dismissed_player, None, None, None, 0
                    ))

            # Insert Innings Record
            cursor.execute("""
            INSERT OR REPLACE INTO innings (
                match_id, innings_num, batting_team, bowling_team, total_runs, total_wickets, total_overs
            ) VALUES (?, ?, ?, ?, ?, ?, ?);
            """, (match_id, idx, batting_team, bowling_team, total_runs, total_wickets, total_overs))

            # Insert Deliveries
            cursor.executemany("""
            INSERT INTO deliveries (
                match_id, innings_num, over, ball, batter, non_striker, bowler,
                runs_batter, runs_extras, runs_total, is_wicket, dismissal_kind, dismissed_player,
                shot_zone, shot_angle, shot_distance, is_simulated
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, deliveries_to_insert)

        conn.commit()
        print(f"Successfully imported Cricsheet match {match_id} with {len(innings_list)} innings into SQLite.")
        return match_id

if __name__ == "__main__":
    if len(sys.argv) > 1:
        import_cricsheet_json(sys.argv[1])
    else:
        print("Usage: python cricsheet_importer.py <path_to_cricsheet_json>")
