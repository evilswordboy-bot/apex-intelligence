"""
APEX Phase 6 - Automated Test Suite
Validates Live Sports API endpoints, match filters, telemetry details, and standings.
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
    print("  APEX PHASE 6: LIVE SPORTS API VERIFICATION      ")
    print("==================================================")
    
    passed = 0
    total = 0

    # 1. Provider Status
    total += 1
    status, body = test_endpoint(f"{API_BASE}/api/v1/live/providers/status")
    if status == 200 and "provider_name" in body:
        print(f" [PASS] Provider Status: {body['provider_name']} (Live Feed: {body['is_live_feed']})")
        passed += 1
    else:
        print(f" [FAIL] Provider Status failed: {status} -> {body}")

    # 2. Live Matches List
    total += 1
    status, body = test_endpoint(f"{API_BASE}/api/v1/live/matches")
    if status == 200 and isinstance(body, list) and len(body) > 0:
        print(f" [PASS] Matches List returned {len(body)} matches")
        passed += 1
    else:
        print(f" [FAIL] Matches List failed: {status} -> {body}")

    # 3. Filter by sport: cricket
    total += 1
    status, body = test_endpoint(f"{API_BASE}/api/v1/live/matches?sport=cricket")
    if status == 200 and all(m["sport"] == "cricket" for m in body):
        print(f" [PASS] Filter sport=cricket returned {len(body)} cricket matches")
        passed += 1
    else:
        print(f" [FAIL] Filter cricket failed: {status}")

    # 4. Filter by sport: football
    total += 1
    status, body = test_endpoint(f"{API_BASE}/api/v1/live/matches?sport=football")
    if status == 200 and all(m["sport"] == "football" for m in body):
        print(f" [PASS] Filter sport=football returned {len(body)} football matches")
        passed += 1
    else:
        print(f" [FAIL] Filter football failed: {status}")

    # 5. Filter by status: live
    total += 1
    status, body = test_endpoint(f"{API_BASE}/api/v1/live/matches?status=live")
    if status == 200 and all(m["status"].lower() == "live" for m in body):
        print(f" [PASS] Filter status=live returned {len(body)} active live matches")
        passed += 1
    else:
        print(f" [FAIL] Filter live status failed: {status}")

    # 6. Match Details
    total += 1
    status, body = test_endpoint(f"{API_BASE}/api/v1/live/matches/live-cric-01")
    if status == 200 and "events" in body and "lineup_home" in body:
        print(f" [PASS] Match Detail live-cric-01 returned {len(body['events'])} events & {len(body['lineup_home'])} home players")
        passed += 1
    else:
        print(f" [FAIL] Match Detail failed: {status}")

    # 7. Standings: Cricket IPL
    total += 1
    status, body = test_endpoint(f"{API_BASE}/api/v1/live/standings?sport=cricket&league=ipl")
    if status == 200 and isinstance(body, list) and len(body) > 0:
        print(f" [PASS] Standings IPL returned {len(body)} teams (Top: {body[0]['team_name']})")
        passed += 1
    else:
        print(f" [FAIL] Standings IPL failed: {status}")

    # 8. Standings: Football EPL
    total += 1
    status, body = test_endpoint(f"{API_BASE}/api/v1/live/standings?sport=football&league=epl")
    if status == 200 and isinstance(body, list) and len(body) > 0:
        print(f" [PASS] Standings EPL returned {len(body)} teams (Top: {body[0]['team_name']})")
        passed += 1
    else:
        print(f" [FAIL] Standings EPL failed: {status}")

    # 9. Regression Check: Phase 2 Cricket Win Probability Model
    total += 1
    sample_pred = {
        "runs_scored": 145,
        "wickets_lost": 3,
        "overs_completed": 15.2,
        "target_runs": 185
    }
    status, body = test_endpoint(f"{API_BASE}/api/cricket/win-probability", method="POST", data=sample_pred)
    if status == 200 and "batting_team_win_prob" in body:
        print(f" [PASS] Regression: Phase 2 Win Probability API active (Batting Win Prob: {body['batting_team_win_prob']}%)")
        passed += 1
    else:
        print(f" [FAIL] Regression test failed: {status} -> {body}")

    print("--------------------------------------------------")
    print(f"Result: {passed}/{total} tests passed ({(passed/total)*100:.1f}%)")
    print("==================================================")
    return passed == total

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
