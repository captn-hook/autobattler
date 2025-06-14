from pydantic import BaseModel, Field
from flask import Flask, jsonify, request
from enum import Enum
from outlines import models, generate
# import os
# from openai import OpenAI
import base64
# from dotenv import load_dotenv

# load_dotenv()

# api_key = os.getenv("KEY")
# print("API Key:", api_key)

# client = OpenAI(
#     api_key=api_key
# )

class AbilityEnum(str, Enum):
    FIRE = "FIRE",
    WATER = "WATER",
    EARTH = "EARTH",
    AIR = "AIR",
    MAGIC = "MAGIC",
    GHOST = "GHOST",
    STEALTH = "STEALTH",
    WRATH = "WRATH",
    IMMORTAL = "IMMORTAL",
    SHIELD = "SHIELD",
    HEAL = "HEAL",
    STUN = "STUN",
    POISON = "POISON",
    LUCK = "LUCK",
    CHARM = "CHARM",
    INVISIBLE = "INVISIBLE",
    FROST = "FROST",
    LIGHTNING = "LIGHTNING",
    TELEPORT = "TELEPORT",
    CURSE = "CURSE",
    REGENERATE = "REGENERATE",
    BERSERK = "BERSERK",
    CLAIRVOYANCE = "CLAIRVOYANCE",
    CAMOUFLAGE = "CAMOUFLAGE",
    GRAVITY = "GRAVITY",
    PSYCHIC = "PSYCHIC",
    TIME_SHIFT = "TIMESHIFT",
    BLIND = "BLIND",
    VENOM = "VENOM",
    DRAIN = "DRAIN",
    MIRROR = "MIRROR",
    SUMMON = "SUMMON",
    PLAGUE = "PLAGUE",
    AURA = "AURA",
    SACRIFICE = "SACRIFICE",
    DIVINE = "DIVINE",
    FROG = "FROG",
    DOG = "DOG",
    FLY = "FLY",
    SHAPESHIFT = "SHAPESHIFT",
    TELEKINESIS = "TELEKINESIS",
    OMNIPOTENCE = "OMNIPOTENCE",
    OMNIPRESENCE = "OMNIPRESENCE",
    OMNISCIENCE = "OMNISCIENCE",
    REBIRTH = "REBIRTH",
    EARTHQUAKE = "EARTHQUAKE",
    SHADOW = "SHADOW",
    PRECISION = "PRECISION",
    SONG = "SONG",
    CHARGE = "CHARGE",
    SPELLCAST = "SPELLCAST",
    TRANSFORM = "TRANSFORM",
    CRUSH = "CRUSH",
    WISH = "WISH",
    NECROMANCY = "NECROMANCY",
    MULTIATTACK = "MULTIATTACK",
    FISH = "FISH",
    NATURE = "NATURE",

class Ability(BaseModel):
    ability: AbilityEnum
    
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
    ability: str

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

monsters = [dragon, troll, deer, nymph, storm_spirit]

def ollama(Class=Monster):
    try:
        model = models.openai(
            "gemma3:4b",
            base_url="http://localhost:11434/v1",
            api_key='ollama'
        )
    except Exception as e:
        print("Error loading model")

    return generate.json(model, Class)

# def generate_image(monster: Monster):
#     response = client.responses.create(
#         model="gpt-4.1-mini",
#         input="Generate sprite for my game, 28x28 pixels, of this monster: " + monster.description,
#         tools=[{"type": "image_generation"}],
#     )

#     # Save the image to a file
#     image_data = [
#         output.result
#         for output in response.output
#         if output.type == "image_generation_call"
#     ]
        
#     if image_data:
#         image_base64 = image_data[0]
#         with open("temp.png", "wb") as f:
#             f.write(base64.b64decode(image_base64))
            
def monster_fusion(monster1: Monster, monster2: Monster) -> Monster:
    
    abilities = list(AbilityEnum)
    generator = ollama(Monster)

    prompt1 = (
        "Generate a new species of monster that is a fusion of two existing monsters. "
        f"Monster 1: {monster1}\n"
        f"Monster 2: {monster2}\n\n"
        "The new monster should have a fitting name and statistics creatively combining the attributes of both monsters.\n"
        "It's description should reflect it's character and unique features, without directly mentioning it's parents.\n"
        "Keep it concise and creative, using the parent monsters as style guides.\n"
    )
    
    result1 = generator(prompt1)
    
    prompt2 = (
        f'What ability fits this monster: {result1.name},\n'
        f'{result1.description}\n'
        'best? choose from the following:\n'
        ', '.join(ability for ability in abilities if isinstance(ability, str))
    )
    
    generator = ollama(Ability)
    
    result2 = generator(prompt2)
    
    result1.ability = result2.ability
    return result1

def battle_monster(monster1: Monster, monster2: Monster):

    generator = ollama(BattleReport)

    result = generator(
        "Choose a winner in a fight between these two monsters/ Stats are between 1 and 100, with higher numbers indicating stronger attributes. Take the monsters' abilities into account along with their stats.\n"
        f"Monster 1: {monster1}\n"
        f"Monster 2: {monster2}\n\n"
        "Describe the battle outcome, including any special abilities used by the final winner"
    )

    if result.victor == monster1.name:
        monster1.description = result.description + f"\n{monster1.name} wins the battle!"
        return monster1
    elif result.victor == monster2.name:
        monster2.description = result.description + f"\n{monster2.name} wins the battle!"
        return monster2
    else:
        raise ValueError("Invalid battle report: victor not found in the provided monsters.")

def new_monster():

    abilities = list(Ability)
    
    prompt1 = (
        "Generate a new monster for my game, similiar to these: "
        f"{', '.join([str(m) for m in monsters])}\n"
        "The new monster should have a unique name, description, and statistics. Be succinct and creative.\n"
    )
    
    generator = ollama(Monster)
    
    result1 = generator(prompt1)
    
    prompt2 = (
        f'What ability fits this monster: {result1.name},\n'
        f'{result1.description}\n'
        'best? choose from the following:\n'
        ', '.join(ability for ability in abilities if isinstance(ability, str))
    )
    
    generator = ollama(Ability)
    
    result2 = generator(prompt2)
    
    result1.ability = result2.ability
    return result1

app = Flask(__name__)
@app.route('/fusion', methods=['POST'])
def fusion():
    print("Received fusion request")
    try:
        data = request.json
        monster1 = Monster(**data['monster1'])
        monster2 = Monster(**data['monster2'])
        
        new_monster = monster_fusion(monster1, monster2)
        
        # If the new monster has empty fields, return a 500 error
        if new_monster.name == "" or new_monster.description == "" or not new_monster.stats:
            print(new_monster)
            print("Failed to generate a new monster with valid fields")
            return jsonify({"error": "Failed to generate a new monster"}), 500
        
        print("New Monster:\n", new_monster)
        return jsonify(new_monster.model_dump())
    except ValueError as e:
        print("Error during fusion:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/battle', methods=['POST'])
def battle():
    print("Received battle request")
    try:
        data = request.json
        monster1 = Monster(**data['monster1'])
        monster2 = Monster(**data['monster2'])
    
        report = battle_monster(monster1, monster2)
        print("Battle Report:\n", report)
        return jsonify(report.model_dump())
    except ValueError as e:
        print("Error during battle:", e)
        return jsonify({"error": str(e)}), 500

# @app.route('/monster', methods=['GET'])
# def get_monster():
#     monster = new_monster()
#     print("Generated new monster:\n", monster)
#     return jsonify(monster.model_dump())

# @app.route('/image', methods=['POST'])
# def generate_monster_image():
#     data = request.json
#     monster = Monster(**data)
    
#     # return jsonify({"message": "Image generation not currently supported"})
    
#     generate_image(monster)
#     print("Image generated for monster:", monster.name)
#     # Return the path to the generated image
#     return jsonify({"image_path": "temp.png"})

# Run the Flask app
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)