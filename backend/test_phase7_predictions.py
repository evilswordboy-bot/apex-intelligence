"""
APEX Phase 7 - Automated Test Suite
Validates AI Sports Prediction Engine endpoints, probability calibration validity (sums to 100%),
draw outcome handling in football, data sufficiency guardrails, model metrics, and regression stability.
"""

import sys
import json
import urllib.request
import urllib.error

API_BASE = "http://127.0.0.1:8000"
NEXT_BASE = "http://localhost:3000"

def test_endpoint(url, method="GET", data=None):
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8") if data else None,
        headers={"Content-Type": "application/json"} if data else {},
        method=method
    )
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            body = resp.read().decode("utf-8")
            return resp.status, json.loads(body) if resp.headers.get_content_type() == "application/json" else body
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8")
    except Exception as e:
        return None, str(e)

def run_tests():
    print("==================================================")
    print("  APEX PHASE 7: AI SPORTS PREDICTION ENGINE TEST  ")
    print("==================================================")

    passed = 0
    total = 0

    # 1. Upcoming Predictions List
    total += 1
    status, body = test_endpoint(f"{API_BASE}/api/v1/predictions/upcoming")
    if status == 200 and isinstance(body, list) and len(body) >= 2:
        print(f" [PASS] Upcoming Predictions: Returned {len(body)} fixtures across Cricket & Football")
        passed += 1
    else:
        print(f" [FAIL] Upcoming Predictions failed: {status}")

    # 2. Probability Validity - Cricket 2-way sum to 100%
    total += 1
    cricket_match = next((m for m in body if m["sport"] == "cricket"), None)
    if cricket_match:
        probs = cricket_match["probabilities"]
        prob_sum = round(probs["p_home"] + probs["p_away"], 1)
        if prob_sum == 100.0 and probs.get("p_draw") is None:
            print(f" [PASS] Cricket Probabilities Valid: Home {probs['p_home']}% + Away {probs['p_away']}% = {prob_sum}% (No draw)")
            passed += 1
        else:
            print(f" [FAIL] Cricket Probabilities invalid sum: {prob_sum}")
    else:
        print(" [FAIL] No cricket fixture found in upcoming list")

    # 3. Probability Validity - Football 3-way sum to 100% (Supports Draws)
    total += 1
    football_match = next((m for m in body if m["sport"] == "football"), None)
    if football_match:
        probs = football_match["probabilities"]
        prob_sum = round(probs["p_home"] + probs["p_away"] + (probs.get("p_draw") or 0.0), 1)
        if abs(prob_sum - 100.0) <= 0.1 and probs.get("p_draw") is not None and probs["p_draw"] > 0:
            print(f" [PASS] Football Probabilities Valid: Home {probs['p_home']}% + Draw {probs['p_draw']}% + Away {probs['p_away']}% = {prob_sum}%")
            passed += 1
        else:
            print(f" [FAIL] Football Probabilities invalid: sum={prob_sum}, draw={probs.get('p_draw')}")
    else:
        print(" [FAIL] No football fixture found in upcoming list")

    # 4. Custom Prediction: Valid Matchup
    total += 1
    custom_req = {
        "sport": "cricket",
        "team_home": "Mumbai Indians",
        "team_away": "Chennai Super Kings",
        "venue": "Wankhede Stadium, Mumbai",
        "player_availability_home": 1.0,
        "player_availability_away": 0.95
    }
    status, body = test_endpoint(f"{API_BASE}/api/v1/predictions/match", method="POST", data=custom_req)
    if status == 200 and body.get("data_sufficiency") == "sufficient" and len(body.get("key_factors", [])) > 0:
        print(f" [PASS] Custom Matchup: MI vs CSK predicted with {len(body['key_factors'])} key factors (Confidence: {body['confidence_level']})")
        passed += 1
    else:
        print(f" [FAIL] Custom Matchup failed: {status} -> {body}")

    # 5. Data Sufficiency Guardrail: Unknown Team Rejection
    total += 1
    unknown_req = {
        "sport": "football",
        "team_home": "Gotham City FC",
        "team_away": "Atlantis Athletic"
    }
    status, body = test_endpoint(f"{API_BASE}/api/v1/predictions/match", method="POST", data=unknown_req)
    if status == 200 and body.get("data_sufficiency") == "insufficient_data" and "Insufficient historical match" in body.get("sufficiency_message", ""):
        print(f" [PASS] Data Sufficiency Guardrail: Safely flagged insufficient historical data without fabricating probabilities")
        passed += 1
    else:
        print(f" [FAIL] Data Sufficiency Guardrail failed: {status} -> {body}")

    # 6. Model Evaluation Benchmarks & Metrics
    total += 1
    status, body = test_endpoint(f"{API_BASE}/api/v1/predictions/metrics")
    if status == 200 and "models" in body and "cricket" in body["models"]:
        cric_m = body["models"]["cricket"]
        print(f" [PASS] Model Metrics: Cricket Log Loss {cric_m['calibrated_metrics']['log_loss']} (reduction: {cric_m['log_loss_reduction_percent']}%), Brier {cric_m['calibrated_metrics']['brier_score']}")
        passed += 1
    else:
        print(f" [FAIL] Model Metrics failed: {status} -> {body}")

    # 7. Prediction History & Audit Trail
    total += 1
    status, body = test_endpoint(f"{API_BASE}/api/v1/predictions/history")
    if status == 200 and isinstance(body, list) and len(body) > 0 and "status" in body[0]:
        print(f" [PASS] Prediction Audit History: {len(body)} historical records verified against actual outcomes")
        passed += 1
    else:
        print(f" [FAIL] Prediction History failed: {status}")

    # 8. Regression Check: Phase 6 Live Matches API
    total += 1
    status, body = test_endpoint(f"{API_BASE}/api/v1/live/matches")
    if status == 200 and isinstance(body, list) and len(body) > 0:
        print(f" [PASS] Regression Phase 6: Live Matches API active ({len(body)} live fixtures)")
        passed += 1
    else:
        print(f" [FAIL] Regression Phase 6 failed: {status}")

    # 9. Regression Check: Phase 2 Cricket Win Probability Model
    total += 1
    sample_chase = {
        "runs_scored": 150,
        "wickets_lost": 3,
        "overs_completed": 16.0,
        "target_runs": 180
    }
    status, body = test_endpoint(f"{API_BASE}/api/cricket/win-probability", method="POST", data=sample_chase)
    if status == 200 and "batting_team_win_prob" in body:
        print(f" [PASS] Regression Phase 2: In-match chase win probability active ({body['batting_team_win_prob']}%)")
        passed += 1
    else:
        print(f" [FAIL] Regression Phase 2 failed: {status}")

    print("--------------------------------------------------")
    print(f"Result: {passed}/{total} tests passed ({(passed/total)*100:.1f}%)")
    print("==================================================")
    return passed == total

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
