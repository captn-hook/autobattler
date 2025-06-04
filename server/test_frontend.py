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
        "SHIELD", "HEAL", "STUN", "POISON", "LUCK", "CHARM", "INVISIBLE", "FROST", 
        "LIGHTNING", "TELEPORT", "CURSE", "REGENERATE", "BERSERK", "CLAIRVOYANCE", 
        "CAMOUFLAGE", "GRAVITY", "PSYCHIC", "TIMESHIFT", "BLIND", "VENOM", "DRAIN", 
        "MIRROR", "SUMMON", "PLAGUE", "AURA", "SACRIFICE", "DIVINE", "FROG", "DOG", 
        "FLY", "SHAPESHIFT", "TELEKINESIS", "OMNIPOTENCE", "OMNIPRESENCE", "OMNISCIENCE",
        "REBIRTH", "EARTHQUAKE", "SHADOW", "PRECISION",
        "SONG", "CHARGE", "SPELLCAST", "TRANSFORM", "CRUSH", "WISH",
        "NECROMANCY", "MULTIATTACK", "FISH", "NATURE"
    ]

    def __str__(self):
        return (f"Name: {self.name}, Description: {self.description}, "
                f"Stats: {self.stats}, Ability: {self.ability}")

class BattleReport(BaseModel):
    winner: int
    loser: int
    description: str
    
    def __str__(self):
        return (f"{self.description}\n"
                f"{self.victor} wins the battle!")
        
class BattleReportDatabase(BattleReport):
    id: str = ""  # Filled by the server, includes both monster IDs
        
class MonsterDatabase(Monster):
    # This class extends the Monster class to represent as it is in the database
    id: int = 0 # Filled by the server, sequential
    created_at: str = "" # Filled by the server
    owner: str = "" # Filled by the server, will be blank from this test script
    fusionId: str = ""  # Filled by the server, will be blank from this test script
    wins: list[int] = []  # List of battle report IDs where this monster won
    losses: list[int] = []  # List of battle report IDs where this monster lost
    level: int = 1  # Starting level for the monster, always one for now
    
progenitor = MonsterDatabase(
    name="Progenitor",
    description="The first monster, creator of all monsters",
    stats=Stats(health=1, defense=1, strength=1, intelligence=1, speed=1, magic=1, stealth=1, luck=1, charm=1),
    ability="OMNIPOTENCE",
    fusionId="0-0", 
    level=100,
)

magic = MonsterDatabase(
    name="Magic",
    description="A primordial being of pure magic, the source of all magical abilities",
    stats=Stats(health=50, defense=10, strength=10, intelligence=80, speed=10, magic=100, stealth=1, luck=50, charm=1),
    ability="MAGIC",
    fusionId=str(progenitor.id) + '-' + str(progenitor.id),  # Fusion ID is the progenitor's ID
    level=99,
)

earth = MonsterDatabase(
    name="Earth God",
    description="A primordial being that is the source of all earth essence",
    stats=Stats(health=50, defense=100, strength=80, intelligence=10, speed=1, magic=50, stealth=1, luck=1, charm=1),
    ability="EARTH",
    fusionId=str(progenitor.id) + '-' + str(magic.id), 
    level=98,
)

fire = MonsterDatabase(
    name="Fire God",
    description="A primordial being that is the source of all fire essence",
    stats=Stats(health=50, defense=10, strength=100, intelligence=10, speed=1, magic=50, stealth=1, luck=1, charm=1),
    ability="FIRE",
    fusionId=str(progenitor.id) + '-' + str(magic.id),
    level=98
)

water = MonsterDatabase(
    name="Water God",
    description="A primordial being that is the source of all water essence",
    stats=Stats(health=50, defense=10, strength=10, intelligence=100, speed=1, magic=50, stealth=1, luck=1, charm=1),
    ability="WATER",
    fusionId=str(progenitor.id) + '-' + str(magic.id),
    level=98
)

air = MonsterDatabase(
    name="Air God",
    description="A primordial being that is the source of all air essence",
    stats=Stats(health=50, defense=10, strength=10, intelligence=10, speed=100, magic=50, stealth=1, luck=1, charm=1),
    ability="AIR",
    fusionId=str(progenitor.id) + '-' + str(magic.id),
    level=98
)

nature = MonsterDatabase(
    name="Nature",
    description="A primordial being that embodies the essence of nature",
    stats=Stats(health=50, defense=50, strength=50, intelligence=50, speed=50, magic=50, stealth=1, luck=1, charm=1),
    ability="NATURE",
    fusionId=str(earth.id) + '-' + str(magic.id),
    level=97
)

lizard = MonsterDatabase(
    name="Lizard",
    description="A small lizard that can camouflage itself in its surroundings",
    stats=Stats(health=1, defense=1, strength=1, intelligence=1, speed=1, magic=1, stealth=100, luck=100, charm=1),\
    ability="CAMOUFLAGE",
    fusionId=str(nature.id) + '-' + str(earth.id), 
)
    
fish = MonsterDatabase(
    name="Fish",
    description="A small fish that swims in the ocean, can breathe underwater",
    stats=Stats(health=1, defense=1, strength=1, intelligence=1, speed=1, magic=1, stealth=40, luck=6, charm=1),
    ability="FISH",
    fusionId=str(nature.id) + '-' + str(water.id),
)

frog = MonsterDatabase(
    name="Frog",
    description="A small frog that can jump high and catch insects with its tongue",
    stats=Stats(health=1, defense=1, strength=1, intelligence=1, speed=1, magic=1, stealth=50, luck=10, charm=1),
    ability="FROG",
    fusionId=str(water.id) + '-' + str(earth.id),
)

dog = MonsterDatabase(
    name="Dog",
    description="A loyal dog that can track scents and bark loudly",
    stats=Stats(health=1, defense=1, strength=1, intelligence=1, speed=1, magic=1, stealth=20, luck=5, charm=1),
    ability="DOG",
    fusionId=str(nature.id) + '-' + str(progenitor.id,) 
)
        
dragon = MonsterDatabase(
    name="Dragon",
    description="A fierce dragon with scales as tough as steel",
    stats=Stats(health=100, defense=90, strength=80, intelligence=70, speed=100, magic=90, stealth=30, luck=50, charm=50),
    ability="FIRE",
    fusionId=str(fire.id) + '-' + str(lizard.id),
)

troll = MonsterDatabase(
    name="Troll",
    description="A hulking troll who lives in a cave",
    stats=Stats(health=80, defense=70, strength=90, intelligence=30, speed=40, magic=20, stealth=10, luck=70, charm=10),
    ability="EARTH",
    fusionId=str(earth.id) + '-' + str(magic.id),
)

deer = MonsterDatabase(
    name="Deer",
    description="A graceful deer that runs away at the slightest sound",
    stats=Stats(health=10, defense=5, strength=15, intelligence=20, speed=80, magic=5, stealth=90, luck=90, charm=80),
    ability="STEALTH",
    fusionId=str(nature.id) + '-' + str(dog.id),
)

nymph = MonsterDatabase(
    name="Nymph",
    description="A mystical nymph that can heal itself and others",
    stats=Stats(health=60, defense=40, strength=30, intelligence=80, speed=70, magic=100, stealth=50, luck=60, charm=90),
    ability="HEAL",
    fusionId=str(water.id) + '-' + str(magic.id),
)

storm_spirit = MonsterDatabase(
    name="Storm Spirit",
    description="A spirit of the storm that can control lightning and wind",
    stats=Stats(health=70, defense=60, strength=50, intelligence=90, speed=80, magic=100, stealth=40, luck=70, charm=60),
    ability="LIGHTNING",
    fusionId=str(air.id) + '-' + str(magic.id),
)
phoenix = MonsterDatabase(
    name="Phoenix",
    description="A majestic bird that rises from its ashes, engulfed in flames",
    stats=Stats(health=100, defense=50, strength=70, intelligence=80, speed=90, magic=100, stealth=40, luck=60, charm=100),
    ability="REBIRTH",
    fusionId=str(fire.id) + '-' + str(magic.id),
)

golem = MonsterDatabase(
    name="Golem",
    description="A massive creature made of stone, nearly indestructible",
    stats=Stats(health=100, defense=100, strength=100, intelligence=30, speed=20, magic=10, stealth=5, luck=40, charm=10),
    ability="EARTHQUAKE",
    fusionId=str(earth.id) + '-' + str(magic.id),
)

griffin = MonsterDatabase(
    name="Griffin",
    description="A noble beast with the body of a lion and the wings of an eagle",
    stats=Stats(health=100, defense=80, strength=90, intelligence=70, speed=80, magic=50, stealth=30, luck=50, charm=70),
    ability="FLY",
    fusionId=str(air.id) + '-' + str(deer.id),
)

hydra = MonsterDatabase(
    name="Hydra",
    description="A multi-headed serpent that regenerates heads when one is cut off",
    stats=Stats(health=100, defense=70, strength=100, intelligence=60, speed=50, magic=40, stealth=20, luck=50, charm=30),
    ability="HEAL",
    fusionId=str(dragon.id) + '-' + str(nymph.id),
)

shadow_wraith = MonsterDatabase(
    name="Shadow Wraith",
    description="A ghostly figure that moves silently and strikes from the shadows",
    stats=Stats(health=50, defense=30, strength=60, intelligence=80, speed=100, magic=90, stealth=100, luck=70, charm=40),
    ability="SHADOW",
    fusionId=str(nymph.id) + '-' + str(storm_spirit.id),
)

centaur = MonsterDatabase(
    name="Centaur",
    description="A half-human, half-horse warrior skilled in archery and combat",
    stats=Stats(health=90, defense=70, strength=80, intelligence=60, speed=70, magic=30, stealth=40, luck=50, charm=60),
    ability="PRECISION",
    fusionId=str(deer.id) + '-' + str(griffin.id),
)

mermaid = MonsterDatabase(
    name="Mermaid",
    description="A beautiful aquatic creature that can enchant sailors with its song",
    stats=Stats(health=60, defense=40, strength=30, intelligence=70, speed=50, magic=80, stealth=50, luck=60, charm=100),
    ability="SONG",
    fusionId=str(fish.id) + '-' + str(nymph.id),
)

minotaur = MonsterDatabase(
    name="Minotaur",
    description="A fearsome beast with the body of a man and the head of a bull",
    stats=Stats(health=100, defense=90, strength=100, intelligence=40, speed=50, magic=20, stealth=30, luck=40, charm=20),
    ability="CHARGE",
    fusionId=str(centaur.id) + '-' + str(deer.id),
)

fairy = MonsterDatabase(
    name="Fairy",
    description="A tiny magical creature that can cast powerful spells",
    stats=Stats(health=40, defense=20, strength=20, intelligence=90, speed=80, magic=100, stealth=70, luck=80, charm=90),
    ability="SPELLCAST",
    fusionId=str(nymph.id) + '-' + str(mermaid.id),
)

werewolf = MonsterDatabase(
    name="Werewolf",
    description="A cursed human that transforms into a wolf under the full moon",
    stats=Stats(health=100, defense=60, strength=90, intelligence=50, speed=80, magic=40, stealth=60, luck=50, charm=40),
    ability="TRANSFORM",
    fusionId=str(minotaur.id) + '-' + str(shadow_wraith.id),
)

vampire = MonsterDatabase(
    name="Vampire",
    description="An undead creature that feeds on the blood of the living",
    stats=Stats(health=80, defense=50, strength=70, intelligence=90, speed=70, magic=60, stealth=80, luck=60, charm=100),
    ability="DRAIN",
    fusionId=str(werewolf.id) + '-' + str(werewolf.id),
)

kraken = MonsterDatabase(
    name="Kraken",
    description="A massive sea monster with tentacles that can crush ships",
    stats=Stats(health=100, defense=100, strength=100, intelligence=50, speed=30, magic=40, stealth=20, luck=30, charm=10),
    ability="CRUSH",
    fusionId=str(fish.id) + '-' + str(fish.id),
)

djinn = MonsterDatabase(
    name="Djinn",
    description="A mystical being that can grant wishes, but at a cost",
    stats=Stats(health=70, defense=40, strength=50, intelligence=100, speed=60, magic=100, stealth=50, luck=80, charm=90),
    ability="WISH",
    fusionId=str(magic.id) + '-' + str(magic.id),
)

lich = MonsterDatabase(
    name="Lich",
    description="A powerful undead sorcerer that commands dark magic",
    stats=Stats(health=90, defense=60, strength=50, intelligence=100, speed=40, magic=100, stealth=30, luck=50, charm=40),
    ability="NECROMANCY",
    fusionId=str(shadow_wraith.id) + '-' + str(shadow_wraith.id),
)

chimera = MonsterDatabase(
    name="Chimera",
    description="A monstrous creature with the heads of a lion, goat, and serpent",
    stats=Stats(health=100, defense=80, strength=100, intelligence=60, speed=70, magic=50, stealth=40, luck=50, charm=30),
    ability="MULTIATTACK",
    fusionId=str(griffin.id) + '-' + str(centaur.id),
)

# Add the protocol to the URL
url = 'http://localhost:3000/api/monsters'

def post_monster(monster: MonsterDatabase):
    response = requests.post(url, json=monster.model_dump())
    if response.status_code == 201:
        print(f"Successfully posted monster: {monster.name}")
    else:
        print(f"Failed to post monster: {monster.name}, Status Code: {response.status_code}")

post_monster(progenitor)
post_monster(magic)
post_monster(earth)
post_monster(fire)
post_monster(water)
post_monster(air)
post_monster(nature)
post_monster(lizard)
post_monster(fish)
post_monster(frog)
post_monster(dog)
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
