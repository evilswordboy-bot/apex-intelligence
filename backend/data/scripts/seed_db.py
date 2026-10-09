import random
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(backend_dir))

from app.database import get_db, init_db

def seed_database():
    init_db()
    
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Clear existing data to ensure clean reproducible seeding
        cursor.execute("DELETE FROM deliveries;")
        cursor.execute("DELETE FROM innings;")
        cursor.execute("DELETE FROM matches;")
        cursor.execute("DELETE FROM players;")
        
        # 1. Players
        players_data = [
            ("P_VK", "Virat Kohli", "India", "Batter", "Right-hand bat", "Right-arm medium", 138.4, 52.8, 8.4),
            ("P_RS", "Rohit Sharma", "India", "Batter", "Right-hand bat", "Right-arm offbreak", 140.2, 32.1, 8.1),
            ("P_SKY", "Suryakumar Yadav", "India", "Batter", "Right-hand bat", "Right-arm offbreak", 168.5, 44.2, 7.8),
            ("P_HP", "Hardik Pandya", "India", "All-Rounder", "Right-hand bat", "Right-arm fast-medium", 142.1, 28.5, 8.1),
            ("P_JB", "Jasprit Bumrah", "India", "Fast Bowler", "Right-hand bat", "Right-arm fast", 65.0, 6.2, 6.4),
            ("P_AR", "Axar Patel", "India", "All-Rounder", "Left-hand bat", "Slow left-arm orthodox", 132.0, 24.5, 7.1),
            
            ("P_MS", "Mitchell Starc", "Australia", "Fast Bowler", "Left-hand bat", "Left-arm fast", 88.0, 11.2, 8.2),
            ("P_PC", "Pat Cummins", "Australia", "Fast Bowler", "Right-hand bat", "Right-arm fast", 125.0, 16.4, 7.8),
            ("P_TH", "Travis Head", "Australia", "Batter", "Left-hand bat", "Right-arm offbreak", 155.4, 34.2, 8.9),
            ("P_SS", "Steve Smith", "Australia", "Batter", "Right-hand bat", "Right-arm legbreak", 126.8, 38.6, 7.5),
            ("P_GW", "Glenn Maxwell", "Australia", "All-Rounder", "Right-hand bat", "Right-arm offbreak", 154.2, 29.8, 8.3),
            ("P_AZ", "Adam Zampa", "Australia", "Spin Bowler", "Right-hand bat", "Right-arm legbreak", 70.0, 7.4, 7.3),
            
            ("P_MSD", "MS Dhoni", "India", "Wicketkeeper", "Right-hand bat", "Right-arm medium", 136.2, 39.4, 8.0),
            ("P_SA", "Shaheen Afridi", "Pakistan", "Fast Bowler", "Left-hand bat", "Left-arm fast", 95.0, 9.8, 7.6),
            ("P_JB_ENG", "Jos Buttler", "England", "Wicketkeeper", "Right-hand bat", "Right-arm medium", 144.6, 35.0, 8.2),
        ]
        
        cursor.executemany("""
        INSERT INTO players (id, name, country, role, batting_style, bowling_style, strike_rate, average, economy)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, players_data)
        
        # 2. Match 1: India vs Australia (Championship Final) - Fully seeded ball-by-ball
        m1_id = "CRI-2026-IND-AUS-WTC"
        cursor.execute("""
        INSERT INTO matches (id, competition, match_type, season, match_date, venue, team1, team2, toss_winner, toss_decision, winner, win_margin, target_runs, is_demo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (m1_id, "Apex Global Championship Series — Finals", "T20", "2026", "2026-05-24", "Lord's Cricket Ground, London", "Australia", "India", "Australia", "bat", "India", "6 wickets", 195, 0))
        
        # Innings 1: Australia (194/7 in 20.0 overs)
        cursor.execute("""
        INSERT INTO innings (match_id, innings_num, batting_team, bowling_team, total_runs, total_wickets, total_overs)
        VALUES (?, ?, ?, ?, ?, ?, ?);
        """, (m1_id, 1, "Australia", "India", 194, 7, 20.0))
        
        # Innings 2: India (198/4 in 18.3 overs - Chase Win)
        cursor.execute("""
        INSERT INTO innings (match_id, innings_num, batting_team, bowling_team, total_runs, total_wickets, total_overs)
        VALUES (?, ?, ?, ?, ?, ?, ?);
        """, (m1_id, 2, "India", "Australia", 198, 4, 18.5))
        
        # Seed realistic deliveries for Innings 2 (The exciting live chase!)
        zones = ["Fine Leg", "Square Leg", "Mid-Wicket", "Long-On", "Long-Off", "Extra Cover", "Point", "Third Man"]
        zone_angles = {
            "Fine Leg": 45.0,
            "Square Leg": 90.0,
            "Mid-Wicket": 135.0,
            "Long-On": 180.0,
            "Long-Off": 225.0,
            "Extra Cover": 270.0,
            "Point": 315.0,
            "Third Man": 350.0
        }
        
        # Scripted high-profile deliveries for innings 2
        ind_deliveries = []
        cur_score = 0
        cur_wickets = 0
        
        bowlers_rotation = ["Mitchell Starc", "Pat Cummins", "Adam Zampa", "Glenn Maxwell"]
        
        for ov in range(1, 19):
            bowler = bowlers_rotation[(ov - 1) % len(bowlers_rotation)]
            for b in range(1, 7):
                # Pick batter
                if cur_wickets == 0:
                    striker = "Rohit Sharma"
                    non_striker = "Virat Kohli"
                elif cur_wickets == 1:
                    striker = "Virat Kohli"
                    non_striker = "Suryakumar Yadav"
                elif cur_wickets == 2:
                    striker = "Virat Kohli"
                    non_striker = "Hardik Pandya"
                else:
                    striker = "Virat Kohli"
                    non_striker = "Axar Patel"
                
                # Determine outcome
                is_w = 0
                dismissal = None
                runs_b = random.choices([0, 1, 2, 4, 6], weights=[35, 30, 12, 16, 7])[0]
                
                # Specific scripted moments
                if ov == 4 and b == 3 and cur_wickets == 0:
                    is_w = 1
                    runs_b = 0
                    dismissal = "caught"
                    cur_wickets += 1
                elif ov == 11 and b == 4 and cur_wickets == 1:
                    is_w = 1
                    runs_b = 0
                    dismissal = "bowled"
                    cur_wickets += 1
                elif ov == 15 and b == 2 and cur_wickets == 2:
                    is_w = 1
                    runs_b = 0
                    dismissal = "lbw"
                    cur_wickets += 1
                
                # Shot attributes
                zone = random.choice(zones)
                angle = zone_angles[zone] + random.uniform(-18.0, 18.0)
                dist = 20.0 + (runs_b * 12.0) + random.uniform(2.0, 10.0) if runs_b > 0 else random.uniform(5.0, 15.0)
                
                cur_score += runs_b
                ind_deliveries.append((
                    m1_id, 2, ov, b, striker, non_striker, bowler, runs_b, 0, runs_b,
                    is_w, dismissal, striker if is_w else None, zone, angle, dist, 0
                ))
        
        # Final over 19 (deliveries 1 to 3 to hit 198)
        for b in range(1, 4):
            runs_b = 4 if b == 3 else 1
            zone = "Mid-Wicket" if b == 3 else "Long-On"
            ind_deliveries.append((
                m1_id, 2, 19, b, "Virat Kohli", "Hardik Pandya", "Mitchell Starc", runs_b, 0, runs_b,
                0, None, None, zone, zone_angles[zone], 78.0, 0
            ))
        
        cursor.executemany("""
        INSERT INTO deliveries (
            match_id, innings_num, over, ball, batter, non_striker, bowler,
            runs_batter, runs_extras, runs_total, is_wicket, dismissal_kind, dismissed_player,
            shot_zone, shot_angle, shot_distance, is_simulated
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, ind_deliveries)

        # 3. Match 2: CSK vs MI (IPL Thriller)
        m2_id = "CRI-2026-CSK-MI-IPL"
        cursor.execute("""
        INSERT INTO matches (id, competition, match_type, season, match_date, venue, team1, team2, toss_winner, toss_decision, winner, win_margin, target_runs, is_demo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (m2_id, "TATA Indian Premier League 2026", "T20", "2026", "2026-04-18", "Wankhede Stadium, Mumbai", "Mumbai Indians", "Chennai Super Kings", "Chennai Super Kings", "field", "Chennai Super Kings", "3 wickets", 188, 1))

        cursor.execute("""
        INSERT INTO innings (match_id, innings_num, batting_team, bowling_team, total_runs, total_wickets, total_overs)
        VALUES (?, ?, ?, ?, ?, ?, ?);
        """, (m2_id, 1, "Mumbai Indians", "Chennai Super Kings", 187, 6, 20.0))

        cursor.execute("""
        INSERT INTO innings (match_id, innings_num, batting_team, bowling_team, total_runs, total_wickets, total_overs)
        VALUES (?, ?, ?, ?, ?, ?, ?);
        """, (m2_id, 2, "Chennai Super Kings", "Mumbai Indians", 189, 7, 19.4))

        # 4. Match 3: ENG vs PAK (ICC T20 Bilateral)
        m3_id = "CRI-2026-ENG-PAK-T20"
        cursor.execute("""
        INSERT INTO matches (id, competition, match_type, season, match_date, venue, team1, team2, toss_winner, toss_decision, winner, win_margin, target_runs, is_demo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, (m3_id, "International T20 Championship Series", "T20", "2026", "2026-06-12", "Edgbaston, Birmingham", "Pakistan", "England", "England", "field", "England", "5 wickets", 172, 1))

        cursor.execute("""
        INSERT INTO innings (match_id, innings_num, batting_team, bowling_team, total_runs, total_wickets, total_overs)
        VALUES (?, ?, ?, ?, ?, ?, ?);
        """, (m3_id, 1, "Pakistan", "England", 171, 8, 20.0))

        cursor.execute("""
        INSERT INTO innings (match_id, innings_num, batting_team, bowling_team, total_runs, total_wickets, total_overs)
        VALUES (?, ?, ?, ?, ?, ?, ?);
        """, (m3_id, 2, "England", "Pakistan", 175, 5, 18.2))

        conn.commit()
        print(f"Successfully seeded {len(players_data)} players, 3 tournament matches, and {len(ind_deliveries)} deliveries into SQLite!")

if __name__ == "__main__":
    seed_database()
