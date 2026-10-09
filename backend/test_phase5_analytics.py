import unittest
import urllib.request
import json

class TestPhase5Analytics(unittest.TestCase):
    BASE_URL = "http://127.0.0.1:8000"
    FRONTEND_URL = "http://127.0.0.1:3000"

    def test_01_backend_health(self):
        url = f"{self.BASE_URL}/health"
        req = urllib.request.urlopen(url)
        self.assertEqual(req.getcode(), 200)
        data = json.loads(req.read().decode())
        self.assertEqual(data["status"], "healthy")

    def test_02_analytics_overview_cricket(self):
        url = f"{self.BASE_URL}/api/v1/analytics/overview?sport=cricket&timeframe=season"
        req = urllib.request.urlopen(url)
        self.assertEqual(req.getcode(), 200)
        data = json.loads(req.read().decode())
        self.assertEqual(data["sport"], "cricket")
        self.assertIn("kpis", data)
        self.assertIn("total_matches", data["kpis"])
        self.assertGreater(data["kpis"]["total_matches"], 0)
        self.assertGreater(len(data["trends"]), 0)

    def test_03_analytics_overview_football(self):
        url = f"{self.BASE_URL}/api/v1/analytics/overview?sport=football&timeframe=30d"
        req = urllib.request.urlopen(url)
        self.assertEqual(req.getcode(), 200)
        data = json.loads(req.read().decode())
        self.assertEqual(data["sport"], "football")
        self.assertIn("kpis", data)
        self.assertGreater(data["kpis"]["total_matches"], 0)

    def test_04_analytics_players(self):
        url = f"{self.BASE_URL}/api/v1/analytics/players?sport=cricket"
        req = urllib.request.urlopen(url)
        self.assertEqual(req.getcode(), 200)
        data = json.loads(req.read().decode())
        self.assertGreater(len(data["players"]), 0)
        player = data["players"][0]
        self.assertIn("name", player)
        self.assertIn("radar", player)
        self.assertEqual(len(player["radar"]), 6)

    def test_05_analytics_compare_players(self):
        url = f"{self.BASE_URL}/api/v1/analytics/compare?sport=cricket&entity_type=player&id_a=vkohli&id_b=rsharma"
        req = urllib.request.urlopen(url)
        self.assertEqual(req.getcode(), 200)
        data = json.loads(req.read().decode())
        self.assertEqual(data["entity_type"], "player")
        self.assertEqual(data["entity_a"]["name"], "Virat Kohli")
        self.assertEqual(data["entity_b"]["name"], "Rohit Sharma")
        self.assertIn("deltas", data)

    def test_06_analytics_deterministic_insights(self):
        url = f"{self.BASE_URL}/api/v1/analytics/insights"
        body = json.dumps({
            "sport": "cricket",
            "entity_id": "vkohli",
            "timeframe": "season"
        }).encode('utf-8')
        req = urllib.request.Request(url, data=body, headers={'Content-Type': 'application/json'})
        res = urllib.request.urlopen(req)
        self.assertEqual(res.getcode(), 200)
        data = json.loads(res.read().decode())
        self.assertEqual(data["entity_name"], "Virat Kohli")
        self.assertIn(data["momentum"], ["accelerating", "stable", "declining"])
        self.assertGreater(len(data["strengths"]), 0)
        self.assertGreater(len(data["vulnerabilities"]), 0)
        self.assertGreater(len(data["coaching_recommendations"]), 0)

    def test_07_frontend_pages(self):
        for route in ["/", "/analytics", "/dashboard", "/agent"]:
            url = f"{self.FRONTEND_URL}{route}"
            req = urllib.request.urlopen(url)
            self.assertEqual(req.getcode(), 200, f"Route {route} failed to respond with 200")

if __name__ == "__main__":
    unittest.main()
