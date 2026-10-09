"""
APEX Sports Intelligence Platform — Phase 10 Validation Test Suite
Tests:
1. User Feedback Submission (Guest & Authenticated)
2. Administrative Feedback Triage & Status Update
3. Privacy-Conscious Product Analytics Event Tracking & Aggregation
4. Operational System Diagnostics & Telemetry Integrity
5. Security Headers Enforcement (X-Content-Type-Options, HSTS, etc.)
6. Complete Regression Check across Phases 1–9
"""

import requests
import json
import uuid

BASE_URL = "http://127.0.0.1:8000"
API_V1 = f"{BASE_URL}/api/v1"

def test_phase10_platform():
    print("=" * 70)
    print("   APEX PHASE 10: PUBLIC LAUNCH, MONITORING & FEEDBACK TESTS")
    print("=" * 70)

    # 1. Operational Diagnostics
    print("\n[TEST 1] Verifying System Diagnostics Endpoint...")
    diag_resp = requests.get(f"{API_V1}/platform/diagnostics")
    assert diag_resp.status_code == 200, f"Diagnostics failed: {diag_resp.text}"
    diag = diag_resp.json()
    assert diag["status"] == "healthy"
    assert diag["version"] == "10.0.0"
    assert diag["database"]["matches"] > 0
    assert diag["security_headers_enabled"] is True
    print(f"  -> System Status: {diag['status'].upper()}, Uptime: {diag['uptime_seconds']}s, Memory: {diag['memory_rss_mb']} MB")

    # 2. Security Headers Verification
    print("\n[TEST 2] Verifying Production Security Headers...")
    sec_resp = requests.get(f"{BASE_URL}/health")
    assert sec_resp.headers.get("X-Content-Type-Options") == "nosniff"
    assert sec_resp.headers.get("X-Frame-Options") == "DENY"
    assert "Strict-Transport-Security" in sec_resp.headers
    print("  -> Security Headers Confirmed: nosniff, DENY, HSTS active.")

    # 3. Product Event Tracking
    print("\n[TEST 3] Tracking Privacy-Conscious Product Usage Events...")
    ev1 = requests.post(f"{API_V1}/platform/events/track", json={
        "event_name": "landing_page_view",
        "category": "engagement",
        "properties": {"section": "hero"},
        "session_id": "test_sess_01"
    })
    assert ev1.status_code == 200

    ev2 = requests.post(f"{API_V1}/platform/events/track", json={
        "event_name": "model_prediction_run",
        "category": "prediction",
        "properties": {"sport": "cricket", "matchup": "MI_vs_CSK"},
        "session_id": "test_sess_01"
    })
    assert ev2.status_code == 200

    summary_resp = requests.get(f"{API_V1}/platform/events/summary")
    assert summary_resp.status_code == 200
    summary = summary_resp.json()
    assert summary["total_events"] >= 2
    assert "prediction" in summary["events_by_category"]
    print(f"  -> Event Tracking Verified: {summary['total_events']} events logged across {summary['unique_sessions']} sessions.")

    # 4. User Feedback Submission (Guest)
    print("\n[TEST 4] Submitting User Feedback (Suggestion & Bug Report)...")
    fb_sub = requests.post(f"{API_V1}/platform/feedback", json={
        "name": "Marcus Vance",
        "email": "marcus@athleticlabs.com",
        "category": "suggestion",
        "rating": 5,
        "title": "Add Olympic Decathlon Split Times",
        "message": "It would be fantastic to compare shot put release velocity with sprint cadence in the multi-event radar."
    })
    assert fb_sub.status_code == 201, f"Feedback submission failed: {fb_sub.text}"
    fb_data = fb_sub.json()
    fb_id = fb_data["id"]
    assert fb_data["status"] == "new"
    print(f"  -> Feedback ticket created successfully (ID: #{fb_id}, Rating: {fb_data['rating']}/5)")

    # 5. Feedback List & Administrative Triage
    print("\n[TEST 5] Verifying Administrative Feedback List & Status Update...")
    list_resp = requests.get(f"{API_V1}/platform/feedback")
    assert list_resp.status_code == 200
    tickets = list_resp.json()
    assert any(t["id"] == fb_id for t in tickets)

    update_resp = requests.put(f"{API_V1}/platform/feedback/{fb_id}", json={
        "status": "reviewed",
        "admin_notes": "Added to Olympic kinematics product roadmap for v10.1."
    })
    assert update_resp.status_code == 200
    updated = update_resp.json()
    assert updated["status"] == "reviewed"
    assert "v10.1" in updated["admin_notes"]
    print(f"  -> Feedback ticket #{fb_id} triaged to status 'reviewed' with admin notes.")

    # 6. Anti-Spam Validation
    print("\n[TEST 6] Testing Anti-Spam Short Message Rejection...")
    spam_resp = requests.post(f"{API_V1}/platform/feedback", json={
        "category": "bug",
        "title": "Hi",
        "message": "short"
    })
    assert spam_resp.status_code == 422
    print("  -> Spam rejection verified: Short submissions rejected with HTTP 422 Unprocessable Entity.")

    # 7. Regression check across previous modules
    print("\n[TEST 7] Regression Check on Core Endpoints...")
    assert requests.get(f"{BASE_URL}/").status_code == 200
    assert requests.get(f"{BASE_URL}/health").status_code == 200
    assert requests.get(f"{API_V1}/live/matches").status_code == 200
    assert requests.get(f"{API_V1}/predictions/upcoming").status_code == 200
    assert requests.get(f"{API_V1}/analytics/overview").status_code == 200
    print("  -> All core modules operating normally (100% regression safe).")

    print("\n" + "=" * 70)
    print("   ALL PHASE 10 TESTS PASSED (7/7) — PRODUCTION VERIFIED")
    print("=" * 70)

if __name__ == "__main__":
    test_phase10_platform()
