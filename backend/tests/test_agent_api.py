import pytest
from fastapi.testclient import TestClient
import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from app.main import app

client = TestClient(app)

def test_agent_tools_list():
    response = client.get("/api/agent/tools")
    assert response.status_code == 200
    data = response.json()
    assert "tools" in data
    tool_ids = [t["id"] for t in data["tools"]]
    assert "match_analyzer_tool" in tool_ids
    assert "batter_vs_bowler_matchup_tool" in tool_ids
    assert "win_probability_predictor_tool" in tool_ids
    assert "bowler_recommendation_tool" in tool_ids

def test_agent_sources_search():
    response = client.get("/api/agent/sources?query=kohli")
    assert response.status_code == 200
    sources = response.json()
    assert isinstance(sources, list)
    assert len(sources) > 0
    assert any("Kohli" in s["title"] or "kohli" in s["excerpt"].lower() for s in sources)

def test_agent_conversations_prompts():
    response = client.get("/api/agent/conversations")
    assert response.status_code == 200
    data = response.json()
    assert "suggested_prompts" in data
    assert "Analyse the current match." in data["suggested_prompts"]

def test_agent_chat_match_analysis():
    payload = {
        "message": "Analyse the current match.",
        "match_context_id": "CRI-2026-IND-AUS-WTC"
    }
    response = client.post("/api/agent/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert len(data["tool_calls"]) > 0
    steps = [s["step"] for s in data["tool_calls"]]
    assert "Thinking" in steps
    assert "Selecting tool" in steps
    assert "Retrieving data" in steps
    assert "Analysing" in steps
    assert "Response ready" in steps
    assert data["structured_card"] is not None
    assert data["structured_card"]["card_type"] == "match_summary"

def test_agent_chat_batter_vs_bowler():
    payload = {
        "message": "Compare these two batters: Kohli vs Starc",
        "match_context_id": "CRI-2026-IND-AUS-WTC"
    }
    response = client.post("/api/agent/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert "Virat Kohli" in data["reply"]
    assert data["structured_card"] is not None
    assert data["structured_card"]["card_type"] == "player_comparison"

def test_agent_chat_win_probability():
    payload = {
        "message": "Why is the chasing team likely to win?",
        "match_context_id": "CRI-2026-IND-AUS-WTC"
    }
    response = client.post("/api/agent/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert data["structured_card"] is not None
    assert data["structured_card"]["card_type"] == "win_probability"

def test_agent_chat_bowler_recommendation():
    payload = {
        "message": "Recommend the next bowler for this over",
        "match_context_id": "CRI-2026-IND-AUS-WTC"
    }
    response = client.post("/api/agent/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert data["structured_card"] is not None
    assert data["structured_card"]["card_type"] == "bowler_recommendation"

def test_agent_chat_empty_message_validation():
    payload = {
        "message": "   "
    }
    response = client.post("/api/agent/chat", json=payload)
    assert response.status_code in [400, 422]
