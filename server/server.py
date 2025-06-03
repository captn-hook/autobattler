from pydantic import BaseModel, Field
from typing import Literal
from flask import Flask, jsonify, request
from outlines import models, generate
import os
from openai import OpenAI
import base64
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("KEY")
print("API Key:", api_key)

client = OpenAI(
    api_key=api_key
)

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

monsters = [dragon, troll, deer, nymph, storm_spirit]

def ollama(Class=Monster):
    model = models.openai(
        "llama3.2:3b",
        base_url="http://localhost:11434/v1",
        api_key='ollama'
    )

    return generate.json(model, Class)

def generate_image(monster: Monster):
    response = client.responses.create(
        model="gpt-4.1-mini",
        input="Generate sprite for my game, 28x28 pixels, of this monster: " + monster.description,
        tools=[{"type": "image_generation"}],
    )

    # Save the image to a file
    image_data = [
        output.result
        for output in response.output
        if output.type == "image_generation_call"
    ]
        
    if image_data:
        image_base64 = image_data[0]
        with open("temp.png", "wb") as f:
            f.write(base64.b64decode(image_base64))
            
def monster_fusion(monster1: Monster, monster2: Monster) -> Monster:
    
    abilities = [
        "FIRE", "WATER", "EARTH", "AIR", "MAGIC", "GHOST", "STEALTH", "WRATH", "IMMORTAL",
        "SHIELD", "HEAL", "STUN", "POISON", "LUCK", "CHARM", "INVISIBILITY", "FROST", 
        "LIGHTNING", "TELEPORT", "CURSE", "REGENERATE", "BERSERK", "CLAIRVOYANCE", 
        "CAMOUFLAGE", "GRAVITY", "PSYCHIC", "TIME_SHIFT", "BLIND", "VENOM", "DRAIN", 
        "MIRROR", "SUMMON", "PLAGUE", "AURA", "SACRIFICE", "DIVINE", "FROG", "DOG", 
        "FLY", "SHAPESHIFT", "TELEKINESIS", "OMNIPOTENCE", "OMNIPRESENCE", "OMNISCIENCE"
    ]

    generator = ollama()

    result = generator(
        "Generate a new species of monster that is a fusion of two existing monsters. "
        f"Monster 1: {monster1}\n"
        f"Monster 2: {monster2}\n\n"
        "The new monster should have a fitting name and statistics creatively combining the attributes of both monsters.\n"
        "It's description should reflect it's character and unique features, without directly mentioning it's parents.\n"
        "And it's special ability should be one of the following that makes the most sense for the new monster: "
        ", ".join(ability for ability in abilities if isinstance(ability, str)) + "\n\n"
    )
    return result

def battle_monster(monster1: Monster, monster2: Monster):

    generator = ollama(BattleReport)

    result = generator(
        "Generate a battle report between two monsters. Stats are between 1 and 100, with higher numbers indicating stronger attributes. Take the monsters' abilities into account along with their stats.\n"
        f"Monster 1: {monster1}\n"
        f"Monster 2: {monster2}\n\n"
        "Describe the battle outcome, including any special abilities used and the final winner"
    )
    return result

def new_monster():
    abilities = [
        "FIRE", "WATER", "EARTH", "AIR", "MAGIC", "GHOST", "STEALTH", "WRATH", "IMMORTAL",
        "SHIELD", "HEAL", "STUN", "POISON", "LUCK", "CHARM", "INVISIBILITY", "FROST", 
        "LIGHTNING", "TELEPORT", "CURSE", "REGENERATE", "BERSERK", "CLAIRVOYANCE", 
        "CAMOUFLAGE", "GRAVITY", "PSYCHIC", "TIME_SHIFT", "BLIND", "VENOM", "DRAIN", 
        "MIRROR", "SUMMON", "PLAGUE", "AURA", "SACRIFICE", "DIVINE", "FROG", "DOG", 
        "FLY", "SHAPESHIFT", "TELEKINESIS", "OMNIPOTENCE", "OMNIPRESENCE", "OMNISCIENCE"
    ]
    
    prompt = [
        "Generate a new monster for my game, similiar to these: "
        f"{', '.join([str(m) for m in monsters])}\n"
        "The new monster should have a unique name, description, and statistics. "
        "It should also have a special ability from this list: "
        ", ".join(ability for ability in abilities if isinstance(ability, str))
    ]
    
    generator = ollama(Monster)
    
    result = generator(prompt)
    
    return result

app = Flask(__name__)
@app.route('/fusion', methods=['POST'])
def fusion():
    data = request.json
    monster1 = Monster(**data['monster1'])
    monster2 = Monster(**data['monster2'])
    
    new_monster = monster_fusion(monster1, monster2)
    
    # If the new monster has empty fields, return a 500 error
    if new_monster.name == "" or new_monster.description == "" or not new_monster.stats:
        return jsonify({"error": "Failed to generate a new monster"}), 500
    
    print("New Monster:\n", new_monster)
    return jsonify(new_monster.model_dump())

@app.route('/battle', methods=['POST'])
def battle():
    data = request.json
    monster1 = Monster(**data['monster1'])
    monster2 = Monster(**data['monster2'])
    
    report = battle_monster(monster1, monster2)
    print("Battle Report:\n", report)
    return jsonify(report.model_dump())

@app.route('/monster', methods=['GET'])
def get_monster():
    monster = new_monster()
    print("Generated new monster:\n", monster)
    return jsonify(monster.model_dump())

@app.route('/image', methods=['POST'])
def generate_monster_image():
    data = request.json
    monster = Monster(**data)
    
    # return jsonify({"message": "Image generation not currently supported"})
    
    generate_image(monster)
    print("Image generated for monster:", monster.name)
    # Return the path to the generated image
    return jsonify({"image_path": "temp.png"})

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True, port=5000)