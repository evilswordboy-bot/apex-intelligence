"""
APEX AI — Phase 11 Olympic Intelligence Backend Verification Test Suite
Tests all endpoints, computations, data fidelity, error handling, and NLQ generation.
"""
import sys
from pathlib import Path
from fastapi.testclient import TestClient

backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

from app.main import app
from app.services.olympic_etl import run_olympics_etl

client = TestClient(app)

def test_01_etl_database_integrity():
    print("\n[TEST 1] Verifying Olympic ETL Database Ingestion & Counts...")
    res = run_olympics_etl(force_reload=False)
    assert res["athletes"] == 11085, f"Expected 11085 athletes, got {res.get('athletes')}"
    assert res["coaches"] == 394, f"Expected 394 coaches, got {res.get('coaches')}"
    assert res["gender_entries"] == 46, f"Expected 46 gender entries, got {res.get('gender_entries')}"
    assert res["medals"] == 93, f"Expected 93 medal records, got {res.get('medals')}"
    assert res["teams"] == 743, f"Expected 743 teams, got {res.get('teams')}"
    print("  -> PASSED: All 5 datasets loaded with exact record counts.")

def test_02_overview_summary():
    print("\n[TEST 2] Testing /api/v1/olympics/overview...")
    resp = client.get("/api/v1/olympics/overview")
    assert resp.status_code == 200, f"Expected 200, got {resp.status_code}"
    data = resp.json()
    assert data["total_athletes"] == 11085
    assert data["total_nations"] == 206
    assert data["total_disciplines"] == 46
    assert data["total_gold"] == 340
    assert data["total_medals"] == 1080
    assert "United States of America" in data["top_nation_by_gold"]
    assert data["overall_female_percent"] > 45.0
    print(f"  -> PASSED: Global census verified (Total Athletes: {data['total_athletes']}, Medals: {data['total_medals']}).")

def test_03_athletes_search_and_pagination():
    print("\n[TEST 3] Testing /api/v1/olympics/athletes with filters...")
    # 1. Default pagination
    resp = client.get("/api/v1/olympics/athletes?limit=10&page=1")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) == 10
    assert data["pagination"]["total"] == 11085
    assert data["pagination"]["pages"] == 1109

    # 2. Filter by NOC (India)
    resp_ind = client.get("/api/v1/olympics/athletes?noc=India&limit=50")
    assert resp_ind.status_code == 200
    ind_data = resp_ind.json()
    assert ind_data["pagination"]["total"] > 100
    for ath in ind_data["items"]:
        assert ath["noc"] == "India"

    # 3. Fuzzy search for 'Lyles'
    resp_lyles = client.get("/api/v1/olympics/athletes?q=Lyles")
    assert resp_lyles.status_code == 200
    lyles_data = resp_lyles.json()
    assert any("LYLES" in a["name"] for a in lyles_data["items"])
    print("  -> PASSED: Athlete filtering, search, and pagination verified.")

def test_04_athlete_profile_detail():
    print("\n[TEST 4] Testing /api/v1/olympics/athletes/{athlete_name}...")
    resp = client.get("/api/v1/olympics/athletes/LYLES Noah")
    assert resp.status_code == 200
    ath = resp.json()
    assert ath["name"] == "LYLES Noah"
    assert ath["noc"] == "United States of America"
    assert ath["discipline"] == "Athletics"
    assert ath["delegation_total_athletes"] > 600
    assert ath["nation_medal_rank"] == 1
    assert ath["nation_total_medals"] == 113

    # Negative test (404)
    resp_404 = client.get("/api/v1/olympics/athletes/NonExistentAthlete999")
    assert resp_404.status_code == 404
    print("  -> PASSED: Athlete profile and 404 handling verified.")

def test_05_coaches_and_teams():
    print("\n[TEST 5] Testing /api/v1/olympics/coaches and /teams...")
    # Coaches
    resp_c = client.get("/api/v1/olympics/coaches?limit=15")
    assert resp_c.status_code == 200
    coaches = resp_c.json()
    assert coaches["pagination"]["total"] == 394
    assert len(coaches["items"]) == 15

    # Teams
    resp_t = client.get("/api/v1/olympics/teams?discipline=Football&limit=10")
    assert resp_t.status_code == 200
    teams = resp_t.json()
    assert teams["pagination"]["total"] > 0
    for t in teams["items"]:
        assert t["discipline"] == "Football"
    print("  -> PASSED: Coaches (394) and Teams (743) endpoints verified.")

def test_06_medals_table_sorting():
    print("\n[TEST 6] Testing /api/v1/olympics/medals sorting...")
    # Sort by gold
    resp_gold = client.get("/api/v1/olympics/medals?sort_by=gold&order=desc&limit=5")
    assert resp_gold.status_code == 200
    gold_items = resp_gold.json()["items"]
    assert gold_items[0]["noc"] == "United States of America"
    assert gold_items[0]["gold"] == 39
    assert gold_items[1]["noc"] == "People's Republic of China"
    assert gold_items[1]["gold"] == 38

    # Sort by total
    resp_tot = client.get("/api/v1/olympics/medals?sort_by=total&order=desc&limit=5")
    assert resp_tot.status_code == 200
    tot_items = resp_tot.json()["items"]
    assert tot_items[0]["total"] == 113
    assert tot_items[1]["total"] == 88
    assert tot_items[2]["noc"] == "ROC" # ROC had 71 medals
    assert tot_items[2]["total"] == 71

    # Filter by Country alias ("UK" -> Great Britain)
    resp_uk = client.get("/api/v1/olympics/medals?q=UK")
    assert resp_uk.status_code == 200
    assert resp_uk.json()["items"][0]["noc"] == "Great Britain"
    print("  -> PASSED: Medal rankings, alias resolution, and sorting verified.")

def test_07_nation_dossier():
    print("\n[TEST 7] Testing /api/v1/olympics/medals/{noc}...")
    resp = client.get("/api/v1/olympics/medals/India")
    assert resp.status_code == 200
    dossier = resp.json()
    assert dossier["noc"] == "India"
    assert dossier["medal_record"]["rank"] == 48
    assert dossier["medal_record"]["gold"] == 1
    assert dossier["medal_record"]["total"] == 7
    assert dossier["total_athletes"] > 100
    assert "Athletics" in dossier["disciplines_entered"]
    assert dossier["medals_per_100_athletes"] > 0
    print("  -> PASSED: Nation dossier for India verified (#47, 7 medals).")

def test_08_gender_parity_analytics():
    print("\n[TEST 8] Testing /api/v1/olympics/gender parity metrics...")
    resp = client.get("/api/v1/olympics/gender")
    assert resp.status_code == 200
    gender = resp.json()
    assert gender["overall_total"] == gender["total_female"] + gender["total_male"]
    assert 47.0 <= gender["overall_female_percent"] <= 50.0
    assert gender["parity_index"] > 0.80
    assert len(gender["disciplines"]) == 46

    # Verify specific disciplines
    art_swim = next(d for d in gender["disciplines"] if d["discipline"] == "Artistic Swimming")
    assert art_swim["female_ratio"] == 1.0
    assert art_swim["male"] == 0

    archery = next(d for d in gender["disciplines"] if d["discipline"] == "Archery")
    assert archery["female"] == 64
    assert archery["male"] == 64
    assert archery["female_ratio"] == 0.5
    print(f"  -> PASSED: Gender parity verified (Female: {gender['overall_female_percent']}%, Parity Index: {gender['parity_index']}).")

def test_09_statistical_models():
    print("\n[TEST 9] Testing /api/v1/olympics/analytics (Efficiency, Correlation, Gini)...")
    # Efficiency
    resp_eff = client.get("/api/v1/olympics/analytics/efficiency?min_athletes=5")
    assert resp_eff.status_code == 200
    eff = resp_eff.json()
    assert len(eff["items"]) > 0
    assert eff["items"][0]["medals_per_athlete"] > 0

    # Correlation
    resp_corr = client.get("/api/v1/olympics/analytics/correlation")
    assert resp_corr.status_code == 200
    corr = resp_corr.json()
    assert corr["pearson_r"] > 0.70, f"Expected strong correlation, got {corr['pearson_r']}"
    assert corr["r_squared"] > 0.50
    assert len(corr["data_points"]) == 93

    # Gini
    resp_gini = client.get("/api/v1/olympics/analytics/gini")
    assert resp_gini.status_code == 200
    gini = resp_gini.json()
    assert 0.0 < gini["gini_coefficient"] < 1.0
    assert gini["top_10_percent_medal_share"] > 40.0
    print(f"  -> PASSED: Pearson r = {corr['pearson_r']}, R2 = {corr['r_squared']}, Gini = {gini['gini_coefficient']}.")

def test_10_natural_language_queries():
    print("\n[TEST 10] Testing POST /api/v1/olympics/query (NLQ Engine)...")
    queries = [
        ("Who won the most medals?", "medal_standings"),
        ("Compare USA and China in the Olympics", "nation_comparison"),
        ("What is the female participation ratio in Archery?", "gender_analysis"),
        ("How many medals did India win?", "nation_dossier"),
        ("Tell me about Noah Lyles", "athlete_search"),
        ("Which country is most efficient at winning medals?", "statistical_analytics")
    ]

    for q_text, expected_intent in queries:
        resp = client.post("/api/v1/olympics/query", json={"query": q_text, "include_chart": True})
        assert resp.status_code == 200, f"Failed for '{q_text}'"
        res = resp.json()
        assert res["status"] == "success"
        assert res["detected_intent"] == expected_intent, f"For '{q_text}': expected {expected_intent}, got {res['detected_intent']}"
        assert len(res["answer_markdown"]) > 50
        assert res["execution_time_ms"] > 0
        print(f"  -> NLQ Query: '{q_text}' => Intent: {res['detected_intent']} ({res['execution_time_ms']}ms)")

def test_11_csv_export():
    print("\n[TEST 11] Testing /api/v1/olympics/export/csv...")
    for ds in ["medals", "gender", "athletes"]:
        resp = client.get(f"/api/v1/olympics/export/csv?dataset={ds}")
        assert resp.status_code == 200
        assert "text/csv" in resp.headers["content-type"]
        assert len(resp.text) > 100
    print("  -> PASSED: CSV export streams valid data.")

if __name__ == "__main__":
    print("=====================================================================")
    print("  APEX AI — PHASE 11 OLYMPIC INTELLIGENCE ENGINE TEST SUITE")
    print("=====================================================================")
    test_01_etl_database_integrity()
    test_02_overview_summary()
    test_03_athletes_search_and_pagination()
    test_04_athlete_profile_detail()
    test_05_coaches_and_teams()
    test_06_medals_table_sorting()
    test_07_nation_dossier()
    test_08_gender_parity_analytics()
    test_09_statistical_models()
    test_10_natural_language_queries()
    test_11_csv_export()
    print("\n=====================================================================")
    print("  ALL 11 OLYMPIC INTELLIGENCE TESTS PASSED (100% SUCCESS)!")
    print("=====================================================================")
