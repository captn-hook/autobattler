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
        "FLY", "SHAPESHIFT", "TELEKINESIS", "OMNIPOTENCE", "OMNIPRESENCE", "OMNISCIENCE",
        "REBIRTH", "EARTHQUAKE", "FLIGHT", "REGENERATION", "SHADOW", "PRECISION",
        "SONG", "CHARGE", "SPELLCAST", "TRANSFORM", "DRAIN", "CRUSH", "WISH",
        "NECROMANCY", "MULTI-ATTACK"
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
phoenix = Monster(
    name="Phoenix",
    description="A majestic bird that rises from its ashes, engulfed in flames",
    stats=Stats(health=100, defense=50, strength=70, intelligence=80, speed=90, magic=100, stealth=40, luck=60, charm=100),
    ability="REBIRTH"
)

golem = Monster(
    name="Golem",
    description="A massive creature made of stone, nearly indestructible",
    stats=Stats(health=100, defense=100, strength=100, intelligence=30, speed=20, magic=10, stealth=5, luck=40, charm=10),
    ability="EARTHQUAKE"
)

griffin = Monster(
    name="Griffin",
    description="A noble beast with the body of a lion and the wings of an eagle",
    stats=Stats(health=100, defense=80, strength=90, intelligence=70, speed=80, magic=50, stealth=30, luck=50, charm=70),
    ability="FLIGHT"
)

hydra = Monster(
    name="Hydra",
    description="A multi-headed serpent that regenerates heads when one is cut off",
    stats=Stats(health=100, defense=70, strength=100, intelligence=60, speed=50, magic=40, stealth=20, luck=50, charm=30),
    ability="REGENERATION"
)

shadow_wraith = Monster(
    name="Shadow Wraith",
    description="A ghostly figure that moves silently and strikes from the shadows",
    stats=Stats(health=50, defense=30, strength=60, intelligence=80, speed=100, magic=90, stealth=100, luck=70, charm=40),
    ability="SHADOW"
)

centaur = Monster(
    name="Centaur",
    description="A half-human, half-horse warrior skilled in archery and combat",
    stats=Stats(health=90, defense=70, strength=80, intelligence=60, speed=70, magic=30, stealth=40, luck=50, charm=60),
    ability="PRECISION"
)

mermaid = Monster(
    name="Mermaid",
    description="A beautiful aquatic creature that can enchant sailors with its song",
    stats=Stats(health=60, defense=40, strength=30, intelligence=70, speed=50, magic=80, stealth=50, luck=60, charm=100),
    ability="SONG"
)

minotaur = Monster(
    name="Minotaur",
    description="A fearsome beast with the body of a man and the head of a bull",
    stats=Stats(health=100, defense=90, strength=100, intelligence=40, speed=50, magic=20, stealth=30, luck=40, charm=20),
    ability="CHARGE"
)

fairy = Monster(
    name="Fairy",
    description="A tiny magical creature that can cast powerful spells",
    stats=Stats(health=40, defense=20, strength=20, intelligence=90, speed=80, magic=100, stealth=70, luck=80, charm=90),
    ability="SPELLCAST"
)

werewolf = Monster(
    name="Werewolf",
    description="A cursed human that transforms into a wolf under the full moon",
    stats=Stats(health=100, defense=60, strength=90, intelligence=50, speed=80, magic=40, stealth=60, luck=50, charm=40),
    ability="TRANSFORM"
)

vampire = Monster(
    name="Vampire",
    description="An undead creature that feeds on the blood of the living",
    stats=Stats(health=80, defense=50, strength=70, intelligence=90, speed=70, magic=60, stealth=80, luck=60, charm=100),
    ability="DRAIN"
)

kraken = Monster(
    name="Kraken",
    description="A massive sea monster with tentacles that can crush ships",
    stats=Stats(health=100, defense=100, strength=100, intelligence=50, speed=30, magic=40, stealth=20, luck=30, charm=10),
    ability="CRUSH"
)

djinn = Monster(
    name="Djinn",
    description="A mystical being that can grant wishes, but at a cost",
    stats=Stats(health=70, defense=40, strength=50, intelligence=100, speed=60, magic=100, stealth=50, luck=80, charm=90),
    ability="WISH"
)

lich = Monster(
    name="Lich",
    description="A powerful undead sorcerer that commands dark magic",
    stats=Stats(health=90, defense=60, strength=50, intelligence=100, speed=40, magic=100, stealth=30, luck=50, charm=40),
    ability="NECROMANCY"
)

chimera = Monster(
    name="Chimera",
    description="A monstrous creature with the heads of a lion, goat, and serpent",
    stats=Stats(health=100, defense=80, strength=100, intelligence=60, speed=70, magic=50, stealth=40, luck=50, charm=30),
    ability="MULTI-ATTACK"
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

post_monster(phoenix)
post_monster(golem)
post_monster(griffin)
post_monster(hydra)
post_monster(shadow_wraith)
post_monster(centaur)
post_monster(mermaid)
post_monster(minotaur)
post_monster(fairy)
post_monster(werewolf)
post_monster(vampire)
post_monster(kraken)
post_monster(djinn)
post_monster(lich)
post_monster(chimera)
