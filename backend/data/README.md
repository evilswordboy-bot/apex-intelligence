# APEX Cricket Lab Data Dictionary & Pipeline Specification

## 1. Overview
The APEX Cricket Data Pipeline stores normalized match and delivery data in SQLite (`cricket.db`). It supports both synthetic demonstration fixtures (explicitly flagged with `is_demo = 1` or `is_simulated = 1`) and actual official Cricsheet archives (`is_demo = 0`, `is_simulated = 0`).

---

## 2. Table Schemas & Data Dictionary

### Table: `matches`
Stores high-level fixture outcomes and tournament metadata.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | PRIMARY KEY | Unique match identifier (e.g. `CRI-2026-IND-AUS-WTC`) |
| `competition` | TEXT | NOT NULL | League or tournament name (e.g. `Apex Global Championship`) |
| `match_type` | TEXT | NOT NULL | Format: `T20`, `ODI`, or `Test` |
| `season` | TEXT | NOT NULL | Season year |
| `match_date` | TEXT | NOT NULL | ISO-8601 date string (`YYYY-MM-DD`) |
| `venue` | TEXT | NOT NULL | Stadium and city location |
| `team1` | TEXT | NOT NULL | Home / First batting team |
| `team2` | TEXT | NOT NULL | Away / Second batting team |
| `toss_winner` | TEXT | NOT NULL | Team winning the toss |
| `toss_decision` | TEXT | NOT NULL | `bat` or `field` |
| `winner` | TEXT | NULLABLE | Winning team |
| `win_margin` | TEXT | NULLABLE | Winning margin (e.g. `6 wickets`, `24 runs`) |
| `target_runs` | INTEGER | NULLABLE | Target score set for 2nd innings |
| `is_demo` | INTEGER | DEFAULT 0 | `1` if synthetic illustration, `0` if recorded match |

### Table: `innings`
Stores aggregated innings totals.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Surrogate key |
| `match_id` | TEXT | FK -> `matches(id)` | Foreign key reference |
| `innings_num`| INTEGER | NOT NULL | `1` or `2` |
| `batting_team`| TEXT | NOT NULL | Team batting |
| `bowling_team`| TEXT | NOT NULL | Team fielding |
| `total_runs` | INTEGER | DEFAULT 0 | Cumulative innings runs |
| `total_wickets`| INTEGER | DEFAULT 0 | Total wickets fallen |
| `total_overs`| REAL | DEFAULT 0.0 | Overs completed (e.g. `20.0`, `18.5`) |

### Table: `deliveries`
Ball-by-ball granular event log.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | Delivery surrogate key |
| `match_id` | TEXT | FK -> `matches(id)` | Foreign key reference |
| `innings_num`| INTEGER | NOT NULL | Active innings |
| `over` | INTEGER | NOT NULL | 1-indexed over number (1-20) |
| `ball` | INTEGER | NOT NULL | Ball within over (1-6+) |
| `batter` | TEXT | NOT NULL | Striker player name |
| `non_striker`| TEXT | NOT NULL | Non-striker partner |
| `bowler` | TEXT | NOT NULL | Active bowler name |
| `runs_batter`| INTEGER | NOT NULL | Runs off bat (0, 1, 2, 3, 4, 6) |
| `runs_extras`| INTEGER | DEFAULT 0 | Wides, no-balls, byes, leg-byes |
| `runs_total` | INTEGER | NOT NULL | Total delivery runs |
| `is_wicket` | INTEGER | DEFAULT 0 | `1` if dismissal occurred, else `0` |
| `dismissal_kind`| TEXT | NULLABLE | `caught`, `bowled`, `lbw`, `run out`, `stumped` |
| `dismissed_player`| TEXT | NULLABLE | Out batter name |
| `shot_zone` | TEXT | NULLABLE | Wagon wheel zone (`Fine Leg`, `Square Leg`, etc.) |
| `shot_angle` | REAL | NULLABLE | Vector angle 0-360° |
| `shot_distance`| REAL | NULLABLE | Distance in meters (0-95m) |
| `is_simulated`| INTEGER | DEFAULT 0 | `1` if illustrative spatial coordinate, `0` if optical Hawk-Eye tracking |

---

## 3. Reproducible Seeding & Ingestion

### Run Seeder:
```bash
python backend/data/scripts/seed_db.py
```

### Import Cricsheet JSON Archive:
```bash
python backend/data/scripts/cricsheet_importer.py <path_to_json_file>
```
