from typing import List, Dict, Any
from app.models.agent_schemas import SourceCitation

# Structured Knowledge Corpus for RAG Index
KNOWLEDGE_CORPUS = [
    {
        "id": "kb-01",
        "title": "ICC World Championship Final 2026: Match State Context",
        "document_type": "Match Telemetry",
        "source": "APEX Tournament Database — Lord's Ground Records",
        "keywords": ["wtc", "final", "india", "australia", "lord's", "target", "kohli", "starc"],
        "content": "In the 2026 ICC World Championship Final at Lord's, Australia posted 194/7 in 20.0 overs. India pursued a target of 195, scoring 198/4 in 18.5 overs to achieve a 6-wicket victory. Virat Kohli anchored the chase with 170 equivalent tournament impact runs off 90 deliveries (20 fours, 7 sixes).",
        "confidence": 0.98
    },
    {
        "id": "kb-02",
        "title": "Calibrated Logistic Win-Probability Baseline Architecture",
        "document_type": "ML Model Spec",
        "source": "APEX Machine Learning Engineering Lab v2.1",
        "keywords": ["win", "probability", "model", "logistic", "brier", "chase", "rrr", "wickets"],
        "content": "The APEX Cricket Win Probability model is a Platt-sigmoid calibrated logistic regression classifier trained on 5,000 game states. It evaluates runs remaining, wickets in hand, balls remaining, current run rate (CRR), and required run rate (RRR). Historical validation reports Brier Score = 0.1339 and Log Loss = 0.4127.",
        "confidence": 0.96
    },
    {
        "id": "kb-03",
        "title": "Tactical Captaincy & Bowler Quota Rules in T20 Cricket",
        "document_type": "Tactical Playbook",
        "source": "ICC T20 Standard Playing Conditions — Clause 13.7",
        "keywords": ["bowler", "recommend", "quota", "death", "powerplay", "over", "economy"],
        "content": "In a 20-over innings, a bowler may bowl a maximum of 4.0 overs. Phase suitability is divided into Powerplay (Overs 1-6), Middle (Overs 7-15), and Death (Overs 16-20). In the death overs, bowling candidates with low boundary percentage and yorker accuracy are prioritized over spinners unless matchups heavily favor turning ball defense.",
        "confidence": 0.95
    },
    {
        "id": "kb-04",
        "title": "Batter vs Bowler Micro-Matchup Mechanics (Kohli vs Starc)",
        "document_type": "Cricsheet Record",
        "source": "Cricsheet Normalized Historical Deliveries Archive 2022-2026",
        "keywords": ["kohli", "starc", "matchup", "h2h", "head to head", "strike rate"],
        "content": "Across recorded professional T20 encounters, Virat Kohli has faced Mitchell Starc across 27 deliveries, scoring 56 runs at a strike rate of 207.4 without a dismissal. His control percentage is 95%, with 5 boundaries (4s) and 3 maximums (6s), rendering this matchup heavily Batter Favored.",
        "confidence": 0.99
    },
    {
        "id": "kb-05",
        "title": "TATA IPL 2026: CSK vs MI El Clasico Overview",
        "document_type": "Match Telemetry",
        "source": "BCCI IPL Telemetry Services — Wankhede Stadium",
        "keywords": ["csk", "mi", "ipl", "chennai", "mumbai", "wankhede", "dhoni", "rohit"],
        "content": "In Match CRI-2026-CSK-MI-IPL at Wankhede Stadium, Mumbai Indians scored 187/6 in 20 overs. Chennai Super Kings chased 188 successfully, scoring 188/7 in 19.4 overs to win by 3 wickets. High-intensity middle over strike rotation was the pivotal tactical differentiator.",
        "confidence": 0.94
    },
    {
        "id": "kb-06",
        "title": "Biomechanical Sprint & Bat Speed Standards",
        "document_type": "Biomechanical Benchmark",
        "source": "APEX Kinematics & Tracking Lab",
        "keywords": ["bat speed", "exit velocity", "biomechanics", "sprint", "running"],
        "content": "Elite top-order batters generate mean bat swing speeds between 128 km/h and 142 km/h. Running speed between wickets peaks at 28.4 km/h with deceleration turn times below 0.82 seconds.",
        "confidence": 0.92
    }
]

def search_knowledge_base(query: str, max_results: int = 3) -> List[SourceCitation]:
    """
    Search the RAG knowledge corpus for relevant documents based on query keywords.
    """
    q_tokens = set(query.lower().split())
    ranked = []

    for item in KNOWLEDGE_CORPUS:
        score = 0
        for kw in item["keywords"]:
            if kw in query.lower():
                score += 3
        for word in q_tokens:
            if word in item["content"].lower() or word in item["title"].lower():
                score += 1
        
        if score > 0:
            ranked.append((score, item))

    # Sort descending by relevance score
    ranked.sort(key=lambda x: x[0], reverse=True)
    results = [item for _, item in ranked[:max_results]]

    # If no specific keyword hit, return top 2 general context items
    if not results:
        results = KNOWLEDGE_CORPUS[:2]

    citations = []
    for doc in results:
        citations.append(SourceCitation(
            id=doc["id"],
            title=doc["title"],
            document_type=doc["document_type"],
            source=doc["source"],
            excerpt=doc["content"],
            confidence=doc["confidence"]
        ))
    return citations
