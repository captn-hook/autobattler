from pydantic import BaseModel, Field
from typing import Literal
from dotenv import load_dotenv
import requests

load_dotenv()

class Stats(BaseModel):
    health: int = Field(..., ge=1, le=100)
    defense: int = Field(..., ge=1, le=100)
    strength: int = Field(..., ge=1, le=100)
    intelligence: int = Field(..., ge=1, le=100)
    speed: int = Field(..., ge=1, le=100)
    magic: int = Field(..., ge=1, le=100)
    stealth: int = Field(..., ge=1, le=100)
    luck: int = Field(..., ge=1, le=100)
    charm: int = Field(..., ge=1, le=100)
    
    def __str__(self):
        return (f"Health: {self.health}, Defense: {self.defense}, Strength: {self.strength}, "
                f"Intelligence: {self.intelligence}, Speed: {self.speed}, Magic: {self.magic}, "
                f"Stealth: {self.stealth}, Luck: {self.luck}, Charm: {self.charm}")

class Monster(BaseModel):
    name: str
    description: str
    stats: Stats
    ability: Literal[
        "FIRE", "WATER", "EARTH", "AIR", "MAGIC", "GHOST", "STEALTH", "WRATH", "IMMORTAL",
        "SHIELD", "HEAL", "STUN", "POISON", "LUCK", "CHARM", "INVISIBILITY", "FROST", 
        "LIGHTNING", "TELEPORT", "CURSE", "REGENERATE", "BERSERK", "CLAIRVOYANCE", 
        "CAMOUFLAGE", "GRAVITY", "PSYCHIC", "TIME_SHIFT", "BLIND", "VENOM", "DRAIN", 
        "MIRROR", "SUMMON", "PLAGUE", "AURA", "SACRIFICE", "DIVINE", "FROG", "DOG", 
        "FLY", "SHAPESHIFT", "TELEKINESIS", "OMNIPOTENCE", "OMNIPRESENCE", "OMNISCIENCE"
    ]

    def __str__(self):
        return (f"Name: {self.name}, Description: {self.description}, "
                f"Stats: {self.stats}, Ability: {self.ability}")

class BattleReport(BaseModel):
    victor: str
    description: str
    
    def __str__(self):
        return (f"{self.description}\n"
                f"{self.victor} wins the battle!")
        
dragon = Monster(
    name="Dragon",
    description="A fierce dragon with scales as tough as steel",
    stats=Stats(health=100, defense=90, strength=80, intelligence=70, speed=100, magic=90, stealth=30, luck=50, charm=50),
    ability="FIRE"
)

troll = Monster(
    name="Troll",
    description="A hulking troll who lives in a cave",
    stats=Stats(health=80, defense=70, strength=90, intelligence=30, speed=40, magic=20, stealth=10, luck=70, charm=10),
    ability="EARTH"
)

deer = Monster(
    name="Deer",
    description="A graceful deer that runs away at the slightest sound",
    stats=Stats(health=10, defense=5, strength=15, intelligence=20, speed=80, magic=5, stealth=90, luck=90, charm=80),
    ability="STEALTH"
)

nymph = Monster(
    name="Nymph",
    description="A mystical nymph that can heal itself and others",
    stats=Stats(health=60, defense=40, strength=30, intelligence=80, speed=70, magic=100, stealth=50, luck=60, charm=90),
    ability="HEAL"
)

storm_spirit = Monster(
    name="Storm Spirit",
    description="A spirit of the storm that can control lightning and wind",
    stats=Stats(health=70, defense=60, strength=50, intelligence=90, speed=80, magic=100, stealth=40, luck=70, charm=60),
    ability="LIGHTNING"
)

# Add the protocol to the URL
url = 'http://localhost:3000/api/monsters'

def post_monster(monster: Monster):
    response = requests.post(url, json=monster.model_dump())
    if response.status_code == 201:
        print(f"Successfully posted monster: {monster.name}")
    else:
        print(f"Failed to post monster: {monster.name}, Status Code: {response.status_code}")

post_monster(dragon)
post_monster(troll)
post_monster(deer)
post_monster(nymph)
post_monster(storm_spirit)