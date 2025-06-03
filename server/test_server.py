import unittest
import requests

URL = "http://69.129.101.124:5000"

class TestFlaskApp(unittest.TestCase):
    def test_fusion_endpoint(self):
        payload = {
            "monster1": {
                "name": "Dragon",
                "description": "A fierce dragon with scales as tough as steel",
                "stats": {
                    "health": 100, "defense": 90, "strength": 80, "intelligence": 70,
                    "speed": 100, "magic": 90, "stealth": 30, "luck": 50, "charm": 50
                },
                "ability": "FIRE"
            },
            "monster2": {
                "name": "Troll",
                "description": "A hulking troll who lives in a cave",
                "stats": {
                    "health": 80, "defense": 70, "strength": 90, "intelligence": 30,
                    "speed": 40, "magic": 20, "stealth": 10, "luck": 70, "charm": 10
                },
                "ability": "EARTH"
            }
        }
        response = requests.post(URL + "/fusion", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertIn("name", response.json())

    def test_battle_endpoint(self):
        payload = {
            "monster1": {
                "name": "Dragon",
                "description": "A fierce dragon with scales as tough as steel",
                "stats": {
                    "health": 100, "defense": 90, "strength": 80, "intelligence": 70,
                    "speed": 100, "magic": 90, "stealth": 30, "luck": 50, "charm": 50
                },
                "ability": "FIRE"
            },
            "monster2": {
                "name": "Troll",
                "description": "A hulking troll who lives in a cave",
                "stats": {
                    "health": 80, "defense": 70, "strength": 90, "intelligence": 30,
                    "speed": 40, "magic": 20, "stealth": 10, "luck": 70, "charm": 10
                },
                "ability": "EARTH"
            }
        }
        response = requests.post(URL + "/battle", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertIn("victor", response.json())

    def test_get_monster_endpoint(self):
        response = requests.get(URL + "/monster")
        self.assertEqual(response.status_code, 200)
        self.assertIn("name", response.json())

    # def test_generate_image_endpoint(self):
    #     payload = {
    #         "name": "Dragon",
    #         "description": "A fierce dragon with scales as tough as steel",
    #         "stats": {
    #             "health": 100, "defense": 90, "strength": 80, "intelligence": 70,
    #             "speed": 100, "magic": 90, "stealth": 30, "luck": 50, "charm": 50
    #         },
    #         "ability": "FIRE"
    #     }
    #     response = requests.post(URL + "/image", json=payload)
    #     self.assertEqual(response.status_code, 200)
    #     self.assertIn("image_path", response.json())

if __name__ == "__main__":
    unittest.main()