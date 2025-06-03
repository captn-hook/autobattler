# Test the fusion endpoint
curl -X POST http://69.129.101.124:5000/fusion \
-H "Content-Type: application/json" \
-d '{
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
}'

# Test the battle endpoint
curl -X POST http://69.129.101.124:5000/battle \
-H "Content-Type: application/json" \
-d '{
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
    "name": "Troooll",
    "description": "A hulking troll who lives in a cave",
    "stats": {
      "health": 80, "defense": 70, "strength": 90, "intelligence": 30,
      "speed": 40, "magic": 20, "stealth": 10, "luck": 70, "charm": 10
    },
    "ability": "EARTH"
  }
}'