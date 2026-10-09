import pytest
from fastapi.testclient import TestClient
import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.main import app

client = TestClient(app)

def test_win_probability_standard_prediction():
    payload = {
        "innings": 2,
        "runs_scored": 150,
        "wickets_lost": 2,
        "overs_completed": 15.0,
        "target_runs": 195
    }
    response = client.post("/api/cricket/win-probability", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert 0.0 <= data["batting_team_win_prob"] <= 100.0
    assert 0.0 <= data["bowling_team_win_prob"] <= 100.0
    assert round(data["batting_team_win_prob"] + data["bowling_team_win_prob"]) == 100
    assert len(data["explanations"]) > 0

def test_win_probability_target_reached_edge_case():
    payload = {
        "innings": 2,
        "runs_scored": 196,
        "wickets_lost": 4,
        "overs_completed": 18.2,
        "target_runs": 195
    }
    response = client.post("/api/cricket/win-probability", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["batting_team_win_prob"] == 100.0
    assert data["bowling_team_win_prob"] == 0.0

def test_win_probability_all_out_edge_case():
    payload = {
        "innings": 2,
        "runs_scored": 140,
        "wickets_lost": 10, # All out!
        "overs_completed": 16.4,
        "target_runs": 195
    }
    response = client.post("/api/cricket/win-probability", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["batting_team_win_prob"] == 0.0
    assert data["bowling_team_win_prob"] == 100.0

def test_win_probability_balls_exhausted_edge_case():
    payload = {
        "innings": 2,
        "runs_scored": 180,
        "wickets_lost": 5,
        "overs_completed": 20.0, # 20 overs finished!
        "target_runs": 195
    }
    response = client.post("/api/cricket/win-probability", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["batting_team_win_prob"] == 0.0
    assert data["bowling_team_win_prob"] == 100.0

def test_win_probability_input_validation():
    # Negative runs scored
    payload = {
        "innings": 2,
        "runs_scored": -10,
        "wickets_lost": 2,
        "overs_completed": 15.0,
        "target_runs": 195
    }
    response = client.post("/api/cricket/win-probability", json=payload)
    assert response.status_code == 422 # Unprocessable entity from Pydantic
