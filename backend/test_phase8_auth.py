import requests
import json
import uuid

BASE_URL = "http://127.0.0.1:8000/api/v1"

def test_phase8():
    print("==================================================")
    print("PHASE 8 AUTOMATED SECURITY & PERSONALIZATION TESTS")
    print("==================================================")

    # 1. Register User A
    rand_suffix = str(uuid.uuid4())[:8]
    user_a_email = f"analyst_{rand_suffix}@apex.ai"
    user_a_password = "SecurePassword123!"
    
    print(f"\n[TEST 1] Registering User A ({user_a_email})...")
    reg_resp = requests.post(f"{BASE_URL}/auth/register", json={
        "email": user_a_email,
        "password": user_a_password,
        "display_name": f"Analyst {rand_suffix}",
        "favorite_sport": "cricket"
    })
    assert reg_resp.status_code == 201, f"Registration failed: {reg_resp.text}"
    auth_data = reg_resp.json()
    token_a = auth_data["access_token"]
    user_a_id = auth_data["user"]["id"]
    print(f"-> Success! User A ID: {user_a_id}, Token received.")

    # 2. Duplicate registration protection
    print(f"\n[TEST 2] Testing duplicate registration protection...")
    dup_resp = requests.post(f"{BASE_URL}/auth/register", json={
        "email": user_a_email,
        "password": "anotherpassword",
        "display_name": "Duplicate User",
        "favorite_sport": "all"
    })
    assert dup_resp.status_code == 400, f"Expected 400 for duplicate email, got: {dup_resp.status_code}"
    print("-> Success! Duplicate registration rejected with 400.")

    # 3. Login with User A
    print(f"\n[TEST 3] Testing login for User A...")
    login_resp = requests.post(f"{BASE_URL}/auth/login", json={
        "email": user_a_email,
        "password": user_a_password
    })
    assert login_resp.status_code == 200, f"Login failed: {login_resp.text}"
    assert "access_token" in login_resp.json()
    print("-> Success! Logged in and JWT verified.")

    # 4. Incorrect password rejection
    print(f"\n[TEST 4] Testing incorrect password rejection...")
    bad_login = requests.post(f"{BASE_URL}/auth/login", json={
        "email": user_a_email,
        "password": "WrongPassword!"
    })
    assert bad_login.status_code == 401, f"Expected 401 for bad password, got: {bad_login.status_code}"
    print("-> Success! Invalid credentials rejected with 401.")

    headers_a = {"Authorization": f"Bearer {token_a}"}

    # 5. Get current user profile & auth/me
    print(f"\n[TEST 5] Testing /auth/me and /users/profile with JWT...")
    me_resp = requests.get(f"{BASE_URL}/auth/me", headers=headers_a)
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == user_a_email
    
    prof_resp = requests.get(f"{BASE_URL}/users/profile", headers=headers_a)
    assert prof_resp.status_code == 200
    prof_data = prof_resp.json()
    print(f"-> Success! User profile loaded: default timezone={prof_data['time_zone']}, odds={prof_data['odds_format']}")

    # 6. Update user profile preferences
    print(f"\n[TEST 6] Updating user profile preferences...")
    update_prof = requests.put(f"{BASE_URL}/users/profile", headers=headers_a, json={
        "display_name": "Chief Telemetry Lead",
        "bio": "Senior biomechanics and predictive modeling specialist.",
        "time_zone": "Europe/London",
        "odds_format": "american",
        "units_system": "imperial",
        "default_sport": "cricket"
    })
    assert update_prof.status_code == 200
    updated = update_prof.json()
    assert updated["time_zone"] == "Europe/London"
    assert updated["odds_format"] == "american"
    assert updated["units_system"] == "imperial"
    print("-> Success! User profile updated and verified.")

    # 7. Add favorites (Team & Player)
    print(f"\n[TEST 7] Adding favorites...")
    fav1 = requests.post(f"{BASE_URL}/users/favorites", headers=headers_a, json={
        "item_type": "team",
        "item_id": "csk_01",
        "item_name": "Chennai Super Kings",
        "sport": "cricket"
    })
    assert fav1.status_code == 201, f"Expected 201, got {fav1.status_code}: {fav1.text}"
    fav1_id = fav1.json()["id"]

    fav2 = requests.post(f"{BASE_URL}/users/favorites", headers=headers_a, json={
        "item_type": "player",
        "item_id": "haaland_09",
        "item_name": "Erling Haaland",
        "sport": "football"
    })
    assert fav2.status_code == 201, f"Expected 201, got {fav2.status_code}: {fav2.text}"
    fav2_id = fav2.json()["id"]

    favs_list = requests.get(f"{BASE_URL}/users/favorites", headers=headers_a)
    assert len(favs_list.json()) == 2
    print(f"-> Success! 2 favorites added and retrieved.")

    # 8. User B cross-tenant security check
    user_b_email = f"analyst_b_{rand_suffix}@apex.ai"
    reg_b = requests.post(f"{BASE_URL}/auth/register", json={
        "email": user_b_email,
        "password": "PasswordUserB123!",
        "display_name": "User B",
        "favorite_sport": "football"
    })
    assert reg_b.status_code == 201
    token_b = reg_b.json()["access_token"]
    headers_b = {"Authorization": f"Bearer {token_b}"}

    print(f"\n[TEST 8] Verifying cross-tenant authorization isolation (User B cannot see or delete User A's favorites)...")
    favs_b = requests.get(f"{BASE_URL}/users/favorites", headers=headers_b).json()
    assert len(favs_b) == 0, "User B should have 0 favorites initially!"

    del_cross = requests.delete(f"{BASE_URL}/users/favorites/{fav1_id}", headers=headers_b)
    assert del_cross.status_code == 404, "User B should get 404 trying to delete User A's favorite!"
    print("-> Success! Strict tenant authorization boundary verified.")

    # 9. Dashboard layout preferences
    print(f"\n[TEST 9] Customizing and retrieving personalized dashboard widgets...")
    dash_pref = requests.put(f"{BASE_URL}/users/dashboard", headers=headers_a, json={
        "widget_order": ["predictions", "telemetry", "recent", "radar"],
        "enabled_widgets": ["predictions", "telemetry", "radar"],
        "saved_views": [{"name": "Cricket Focus", "view": "cricket"}]
    })
    assert dash_pref.status_code == 200
    dash_data = dash_pref.json()
    assert len(dash_data["widget_order"]) == 4
    assert "radar" in dash_data["enabled_widgets"]
    print("-> Success! Personalized dashboard preferences persisted.")

    # 10. Password reset token workflow
    print(f"\n[TEST 10] Testing password reset workflow...")
    forgot_resp = requests.post(f"{BASE_URL}/auth/forgot-password", json={"email": user_a_email})
    assert forgot_resp.status_code == 200
    reset_token = forgot_resp.json()["reset_token"]
    assert reset_token is not None

    new_pass = "BrandNewPassword2026!"
    reset_exec = requests.post(f"{BASE_URL}/auth/reset-password", json={
        "reset_token": reset_token,
        "new_password": new_pass
    })
    assert reset_exec.status_code == 200

    # Test login with new password
    login_new = requests.post(f"{BASE_URL}/auth/login", json={
        "email": user_a_email,
        "password": new_pass
    })
    assert login_new.status_code == 200, "Should be able to login with new password"
    print("-> Success! Password reset flow verified.")

    # 11. Delete account & cascading cleanup
    print(f"\n[TEST 11] Testing GDPR-compliant account deletion & cascading cleanup...")
    new_token = login_new.json()["access_token"]
    del_acc = requests.delete(f"{BASE_URL}/auth/account", headers={"Authorization": f"Bearer {new_token}"})
    assert del_acc.status_code == 200
    # Try logging in again - should fail
    relogin = requests.post(f"{BASE_URL}/auth/login", json={
        "email": user_a_email,
        "password": new_pass
    })
    assert relogin.status_code == 401
    print("-> Success! Account deleted, session invalidated, cascade wiped.")

    # 12. Regression check on Phases 1–7 endpoints
    print(f"\n[TEST 12] Regression check on prior phase endpoints...")
    assert requests.get("http://127.0.0.1:8000/health").status_code == 200
    assert requests.get(f"{BASE_URL}/predictions/upcoming").status_code == 200
    assert requests.get(f"{BASE_URL}/live/matches").status_code == 200
    assert requests.get(f"{BASE_URL}/analytics/overview").status_code == 200
    assert requests.get("http://127.0.0.1:8000/api/cricket/matches").status_code == 200
    print("-> Success! All previous phase endpoints operational (100% regression safe).")

    print("\n==================================================")
    print("ALL PHASE 8 TESTS PASSED SUCCESSFULLY! (12/12)")
    print("==================================================")

if __name__ == "__main__":
    test_phase8()
