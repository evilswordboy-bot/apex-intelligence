"""
APEX Sports Intelligence - Historical Datasets Generator
Generates reproducible, statistically calibrated historical datasets for Cricket and Football (2021-2025)
Used for time-aware training, validation, and benchmarking of Phase 7 AI Sports Prediction Engine.
"""

import os
import csv
import random
from datetime import datetime, timedelta
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent.parent

def generate_cricket_data():
    random.seed(42)
    teams = [
        "Mumbai Indians", "Chennai Super Kings", "Kolkata Knight Riders",
        "Royal Challengers Bengaluru", "Gujarat Titans", "Rajasthan Royals",
        "Delhi Capitals", "Sunrisers Hyderabad", "Lucknow Super Giants", "Punjab Kings"
    ]
    venues = {
        "Wankhede Stadium, Mumbai": {"pace": 0.65, "avg_first_inns": 182, "home_team": "Mumbai Indians"},
        "M. A. Chidambaram Stadium, Chennai": {"pace": 0.40, "avg_first_inns": 164, "home_team": "Chennai Super Kings"},
        "Eden Gardens, Kolkata": {"pace": 0.60, "avg_first_inns": 178, "home_team": "Kolkata Knight Riders"},
        "M. Chinnaswamy Stadium, Bengaluru": {"pace": 0.70, "avg_first_inns": 188, "home_team": "Royal Challengers Bengaluru"},
        "Narendra Modi Stadium, Ahmedabad": {"pace": 0.55, "avg_first_inns": 174, "home_team": "Gujarat Titans"},
        "Sawai Mansingh Stadium, Jaipur": {"pace": 0.50, "avg_first_inns": 166, "home_team": "Rajasthan Royals"},
        "Arun Jaitley Stadium, Delhi": {"pace": 0.58, "avg_first_inns": 175, "home_team": "Delhi Capitals"},
        "Rajiv Gandhi Intl Stadium, Hyderabad": {"pace": 0.62, "avg_first_inns": 180, "home_team": "Sunrisers Hyderabad"},
        "BRSABV Ekana Cricket Stadium, Lucknow": {"pace": 0.45, "avg_first_inns": 158, "home_team": "Lucknow Super Giants"},
        "PCA Stadium, Mohali": {"pace": 0.68, "avg_first_inns": 176, "home_team": "Punjab Kings"}
    }
    
    # Team base strengths (Elo-like scale centered at 1500)
    team_strength = {
        "Mumbai Indians": 1560,
        "Chennai Super Kings": 1570,
        "Kolkata Knight Riders": 1540,
        "Royal Challengers Bengaluru": 1520,
        "Gujarat Titans": 1550,
        "Rajasthan Royals": 1515,
        "Delhi Capitals": 1490,
        "Sunrisers Hyderabad": 1510,
        "Lucknow Super Giants": 1505,
        "Punjab Kings": 1460
    }

    start_date = datetime(2021, 4, 9)
    current_date = start_date
    matches = []
    match_id = 1000

    for season in ["2021", "2022", "2023", "2024", "2025"]:
        season_matches = 74 if season in ["2022", "2023", "2024", "2025"] else 60
        season_start = datetime(int(season), 4, random.randint(1, 10))
        for m in range(season_matches):
            match_id += 1
            t1, t2 = random.sample(teams, 2)
            # Pick venue (favor home team venue with 60% probability)
            matched_venues = [v for v, data in venues.items() if data["home_team"] == t1]
            venue = matched_venues[0] if matched_venues and random.random() < 0.6 else random.choice(list(venues.keys()))
            venue_info = venues[venue]
            
            # Toss
            toss_winner = random.choice([t1, t2])
            toss_decision = "field" if random.random() < 0.72 else "bat"
            
            # Score modeling
            base_score = venue_info["avg_first_inns"]
            s1_skill_mod = (team_strength[t1] - 1500) * 0.05
            s2_skill_mod = (team_strength[t2] - 1500) * 0.05
            
            # First innings score
            first_inns_score = int(round(base_score + s1_skill_mod + random.gauss(0, 16)))
            first_inns_score = max(110, min(245, first_inns_score))
            
            # Second innings chase
            # Chase success base probability around 52% in T20s
            chase_difficulty = (first_inns_score - base_score) * 0.015
            strength_diff = (team_strength[t2] - team_strength[t1]) * 0.002
            is_home_t1 = 1 if venue_info["home_team"] == t1 else 0
            is_home_t2 = 1 if venue_info["home_team"] == t2 else 0
            home_bonus = (is_home_t2 - is_home_t1) * 0.08
            
            prob_t2_chase = 0.52 - chase_difficulty + strength_diff + home_bonus
            prob_t2_chase = max(0.15, min(0.85, prob_t2_chase))
            
            t2_wins = random.random() < prob_t2_chase
            if t2_wins:
                winner = t2
                second_inns_score = first_inns_score + random.randint(1, 6)
                margin = f"{random.randint(2, 8)} wickets"
            else:
                winner = t1
                second_inns_score = first_inns_score - random.randint(3, 35)
                margin = f"{first_inns_score - second_inns_score} runs"
                
            m_date = season_start + timedelta(days=int(m * 0.8))
            matches.append({
                "match_id": f"CRIC-{match_id}",
                "date": m_date.strftime("%Y-%m-%d"),
                "season": season,
                "competition": "Indian Premier League",
                "team1": t1,
                "team2": t2,
                "venue": venue,
                "venue_avg_first_inns": venue_info["avg_first_inns"],
                "pitch_pace_factor": venue_info["pace"],
                "toss_winner": toss_winner,
                "toss_decision": toss_decision,
                "first_innings_score": first_inns_score,
                "second_innings_score": second_inns_score,
                "winner": winner,
                "win_margin": margin
            })

    output_csv = DATA_DIR / "historical_cricket_matches.csv"
    with open(output_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=matches[0].keys())
        writer.writeheader()
        writer.writerows(matches)
    print(f"Generated {len(matches)} historical cricket match records to {output_csv}")


def generate_football_data():
    random.seed(42)
    teams = [
        "Manchester City", "Arsenal", "Liverpool", "Aston Villa",
        "Tottenham Hotspur", "Chelsea", "Newcastle United", "Manchester United",
        "West Ham United", "Brighton & Hove Albion"
    ]
    stadiums = {
        "Manchester City": {"stadium": "Etihad Stadium", "capacity": 53400},
        "Arsenal": {"stadium": "Emirates Stadium", "capacity": 60704},
        "Liverpool": {"stadium": "Anfield", "capacity": 61276},
        "Aston Villa": {"stadium": "Villa Park", "capacity": 42682},
        "Tottenham Hotspur": {"stadium": "Tottenham Hotspur Stadium", "capacity": 62850},
        "Chelsea": {"stadium": "Stamford Bridge", "capacity": 40341},
        "Newcastle United": {"stadium": "St. James' Park", "capacity": 52305},
        "Manchester United": {"stadium": "Old Trafford", "capacity": 74310},
        "West Ham United": {"stadium": "London Stadium", "capacity": 62500},
        "Brighton & Hove Albion": {"stadium": "Amex Stadium", "capacity": 31800}
    }
    
    # Team attack and defense ratings (Elo/strength index)
    ratings = {
        "Manchester City": {"att": 92, "def": 88},
        "Arsenal": {"att": 89, "def": 90},
        "Liverpool": {"att": 90, "def": 86},
        "Aston Villa": {"att": 84, "def": 81},
        "Tottenham Hotspur": {"att": 83, "def": 78},
        "Chelsea": {"att": 82, "def": 80},
        "Newcastle United": {"att": 81, "def": 81},
        "Manchester United": {"att": 80, "def": 79},
        "West Ham United": {"att": 77, "def": 76},
        "Brighton & Hove Albion": {"att": 79, "def": 77}
    }

    matches = []
    match_id = 5000

    for season in ["2021-22", "2022-23", "2023-24", "2024-25"]:
        start_year = int(season[:4])
        season_start = datetime(start_year, 8, 12)
        # Double round robin: each pair plays home and away
        round_matches = []
        for h in teams:
            for a in teams:
                if h != a:
                    round_matches.append((h, a))
        random.shuffle(round_matches)
        
        for idx, (home, away) in enumerate(round_matches):
            match_id += 1
            m_date = season_start + timedelta(days=int(idx * 2.8))
            
            # Poisson-like goal generation based on attack vs defense ratings
            home_att = ratings[home]["att"]
            home_def = ratings[home]["def"]
            away_att = ratings[away]["att"]
            away_def = ratings[away]["def"]
            
            # Home advantage gives ~+0.35 xG
            home_expected_xg = max(0.5, (home_att - away_def) * 0.05 + 1.55)
            away_expected_xg = max(0.3, (away_att - home_def) * 0.05 + 1.15)
            
            # Sample goals with Poisson approximation
            home_goals = int(round(max(0, random.gauss(home_expected_xg, 1.0))))
            away_goals = int(round(max(0, random.gauss(away_expected_xg, 0.95))))
            
            if home_goals > away_goals:
                result = "H"
            elif home_goals == away_goals:
                result = "D"
            else:
                result = "A"
                
            matches.append({
                "match_id": f"FOOT-{match_id}",
                "date": m_date.strftime("%Y-%m-%d"),
                "season": season,
                "competition": "English Premier League",
                "home_team": home,
                "away_team": away,
                "venue": stadiums[home]["stadium"],
                "home_xg": round(home_expected_xg + random.uniform(-0.2, 0.2), 2),
                "away_xg": round(away_expected_xg + random.uniform(-0.2, 0.2), 2),
                "home_goals": home_goals,
                "away_goals": away_goals,
                "result": result
            })

    output_csv = DATA_DIR / "historical_football_matches.csv"
    with open(output_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=matches[0].keys())
        writer.writeheader()
        writer.writerows(matches)
    print(f"Generated {len(matches)} historical football match records to {output_csv}")

if __name__ == "__main__":
    generate_cricket_data()
    generate_football_data()
