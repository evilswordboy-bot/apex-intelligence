from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any

from app.models.agent_schemas import (
    ChatRequest,
    ChatResponse,
    SourceCitation,
    ToolCallStep
)
from app.services.agent.agent_service import execute_agent_pipeline
from app.services.agent.rag_service import search_knowledge_base, KNOWLEDGE_CORPUS

router = APIRouter(prefix="/api/agent", tags=["AI Sports Agent"])

@router.post("/chat", response_model=ChatResponse)
async def chat_with_agent(request: ChatRequest):
    """
    Main conversational endpoint for the AI Sports Intelligence Agent.
    Executes tool calling, RAG document search, and structured insights generation.
    """
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    try:
        return await execute_agent_pipeline(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent processing error: {str(e)}")

@router.get("/tools")
def list_available_tools():
    """
    Returns registered tools available to the AI Agent.
    """
    return {
        "tools": [
            {
                "id": "match_analyzer_tool",
                "name": "Match Telemetry Analyzer",
                "description": "Retrieves live scorecards, innings run rates, and chase progression.",
                "parameters": ["match_id"]
            },
            {
                "id": "batter_vs_bowler_matchup_tool",
                "name": "Head-to-Head Micro-Matchup Tool",
                "description": "Calculates strike rate, boundary frequency, and dismissal record between batter and bowler.",
                "parameters": ["batter", "bowler"]
            },
            {
                "id": "win_probability_predictor_tool",
                "name": "Calibrated ML Win Probability Engine",
                "description": "Computes real-time win probability with Platt scaling and feature attributions.",
                "parameters": ["runs", "wickets", "overs", "target"]
            },
            {
                "id": "bowler_recommendation_tool",
                "name": "AI Bowler Quota Advisor",
                "description": "Recommends optimal bowler for an upcoming over based on phase, quota, and matchups.",
                "parameters": ["match_id", "over", "striker"]
            },
            {
                "id": "player_performance_summary_tool",
                "name": "Player Impact Index Evaluator",
                "description": "Synthesizes multi-tournament performance, bat speed, and clutch ratings.",
                "parameters": ["player_name"]
            }
        ]
    }

@router.get("/sources", response_model=List[SourceCitation])
def query_knowledge_sources(query: str = Query("cricket")):
    """
    RAG retrieval endpoint searching verified knowledge documents.
    """
    return search_knowledge_base(query, max_results=5)

@router.get("/conversations")
def get_sample_conversations():
    """
    Returns sample suggested conversation starters.
    """
    return {
        "suggested_prompts": [
            "Analyse the current match.",
            "Compare these two batters.",
            "Why is the chasing team likely to win?",
            "Recommend the next bowler.",
            "Summarise this player's recent performance."
        ]
    }
