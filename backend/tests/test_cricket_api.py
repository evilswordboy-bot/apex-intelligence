import pytest
from fastapi.testclient import TestClient
import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.main import app
from app.database import init_db
from data.scripts.seed_db import seed_database

@pytest.fixture(scope="module", autouse=True)
def setup_test_db():
    seed_database()

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "sqlite_ready"

def test_list_matches():
    response = client.get("/api/cricket/matches")
    assert response.status_code == 200
    matches = response.json()
    assert len(matches) >= 3
    assert any(m["id"] == "CRI-2026-IND-AUS-WTC" for m in matches)

def test_get_match_detail_success():
    response = client.get("/api/cricket/matches/CRI-2026-IND-AUS-WTC")
    assert response.status_code == 200
    data = response.json()
    assert data["match_info"]["id"] == "CRI-2026-IND-AUS-WTC"
    assert len(data["innings"]) >= 2
    # Check batting scorecard
    inn2 = data["innings"][1]
    assert len(inn2["batters"]) > 0
    assert any(b["name"] == "Virat Kohli" for b in inn2["batters"])

def test_get_match_detail_not_found():
    response = client.get("/api/cricket/matches/NONEXISTENT-MATCH-ID")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()

def test_matchup_stats_valid():
    response = client.get("/api/cricket/matchup?batter=Virat+Kohli&bowler=Mitchell+Starc")
    assert response.status_code == 200
    data = response.json()
    assert data["batter"] == "Virat Kohli"
    assert data["bowler"] == "Mitchell Starc"
    assert data["balls_faced"] > 0
    assert 0.0 <= data["control_percentage"] <= 100.0

def test_matchup_stats_invalid_empty():
    response = client.get("/api/cricket/matchup?batter=&bowler=Mitchell+Starc")
    assert response.status_code == 400

def test_phase_analysis():
    response = client.get("/api/cricket/phase-analysis?match_id=CRI-2026-IND-AUS-WTC&innings=2")
    assert response.status_code == 200
    data = response.json()
    assert len(data["phases"]) == 3
    assert data["phases"][0]["phase_name"].startswith("Powerplay")
    assert data["phases"][2]["phase_name"].startswith("Death")

def test_phase_analysis_invalid_innings():
    response = client.get("/api/cricket/phase-analysis?match_id=CRI-2026-IND-AUS-WTC&innings=5")
    assert response.status_code == 400

def test_wagon_wheel():
    response = client.get("/api/cricket/wagon-wheel?match_id=CRI-2026-IND-AUS-WTC")
    assert response.status_code == 200
    data = response.json()
    assert "zones" in data
    assert len(data["zones"]) == 8
    assert data["total_runs"] > 0

def test_bowler_recommendation():
    payload = {
        "match_id": "CRI-2026-IND-AUS-WTC",
        "innings_num": 2,
        "target_over": 18,
        "striker_batter": "Virat Kohli",
        "runs_remaining": 22,
        "wickets_remaining": 6
    }
    response = client.post("/api/cricket/bowler-recommendation", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["phase"] == "Death Overs (Overs 16-20)"
    assert len(data["ranked_bowlers"]) > 0
    assert data["ranked_bowlers"][0]["recommended_rank"] == 1

def test_bowler_recommendation_invalid_over():
    payload = {
        "match_id": "CRI-2026-IND-AUS-WTC",
        "innings_num": 2,
        "target_over": 25, # Invalid over!
        "striker_batter": "Virat Kohli",
        "runs_remaining": 22,
        "wickets_remaining": 6
    }
    response = client.post("/api/cricket/bowler-recommendation", json=payload)
    assert response.status_code in [400, 422]
