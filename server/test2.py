from pydantic import BaseModel, Field

from outlines import models, generate

import random

import os

api_key = os.getenv('KEY')

class Monster(BaseModel):
    name: str
    size: str = Field(..., pattern="^(tiny|small|medium|large|huge|giant)$")
    color: str
    element: str = Field(..., pattern="^(fire|water|earth|air|lightning|ice|poison|darkness|light)$")
    movement: str = Field(..., pattern="^(crawling|walking|running|flying|swimming|floating)$")
    personality: str
    abilities: list[str]
    habitat: str
    diet: str = Field(..., pattern="^(herbivore|carnivore|omnivore|magic|blood|fruit|insect)$")
    lifespan: str = Field(..., pattern="^(short|moderate|long|ancient|eternal)$")
    description: str
    speed: int = Field(..., ge=0, le=100)  # Minimum 0, Maximum 100
    strength: int = Field(..., ge=0, le=100)
    cunning: int = Field(..., ge=0, le=100) 
    magic: int = Field(..., ge=0, le=100)  
    charm: int = Field(..., ge=0, le=100)


    # Provide a method to represent the monster as a string
    def __str__(self):
        return (f"Name: {self.name}\n"
                f"Size: {self.size}\n"
                f"Color: {self.color}\n"
                f"Element: {self.element}\n"
                f"Movement: {self.movement}\n"
                f"Personality: {self.personality}\n"
                f"Abilities: {', '.join(self.abilities)}\n"
                f"Habitat: {self.habitat}\n"
                f"Diet: {self.diet}\n"
                f"Lifespan: {self.lifespan}\n"
                f"Description: {self.description}\n"
                f"Speed: {self.speed}\n"
                f"Strength: {self.strength}\n"
                f"Cunning: {self.cunning}\n"
                f"Magic: {self.magic}\n"
                f"Charm: {self.charm}")   

class RoundReport(BaseModel):
    monster1_action: str
    monster2_action: str
    description: str

class BattleReport(BaseModel):
    monster1: Monster
    monster2: Monster
    
    round_one: RoundReport
    round_two: RoundReport
    round_three: RoundReport

    outcome: str
dragon = Monster(
    name="Dragon",
    size="giant",
    color="Red",
    element="fire",
    movement="flying",
    personality="Proud",
    abilities=["Fire Breath", "Intimidation", "Slashing Claws"],
    habitat="Mountains",
    diet="carnivore",
    lifespan="ancient",
    description="A majestic creature with scales that shimmer in the sunlight.",
    speed=90,
    strength=90,
    cunning=80,
    magic=50,
    charm=20,
)

troll = Monster(
    name="Troll",
    size="large",
    color="Green",
    element="earth",
    movement="walking",
    personality="Grumpy",
    abilities=["Intimidation", "Rock Throw", "Club Swing"],
    habitat="Caves",
    diet="carnivore",
    lifespan="long",
    description="A hulking brute with thick skin and a foul temper.",
    speed=40,
    strength=80,
    cunning=30,
    magic=10,
    charm=5,
)

deer = Monster(
    name="Deer",
    size="small",
    color="Brown",
    element="earth",
    movement="walking",
    personality="Gentle",
    abilities=["Run Away", "Kick", "Camouflage"],
    habitat="Forests",
    diet="herbivore",
    lifespan="moderate",
    description="A graceful creature known for its speed and agility.",
    speed=70,
    strength=10,
    cunning=20,
    magic=5,
    charm=40,
)

nymph = Monster(
    name="Nymph",
    size="small",
    color="Green",
    element="water",
    movement="floating",
    personality="Mischievous",
    abilities=["Healing", "Illusion", "Nature Control"],
    habitat="Rivers",
    diet="fruit",
    lifespan="long",
    description="A mystical being that embodies the spirit of nature.",
    speed=30,
    strength=5,
    cunning=60,
    magic=80,
    charm=90,
)

storm_spirit = Monster(
    name="Storm Spirit",
    size="medium",
    color="Blue",
    element="air",
    movement="flying",
    personality="Furious",
    abilities=["Lightning Strike", "Wind Gust", "Thunder Roar"],
    habitat="Mountaintops",
    diet="magic",
    lifespan="eternal",
    description="A tempestuous entity that commands the skies.",
    speed=80,
    strength=70,
    cunning=50,
    magic=90,
    charm=30,
)

monsters = [dragon, troll, deer, nymph, storm_spirit]

def ollama(Class=Monster):
    model = models.openai(
        "llama3.2:3b",
        base_url="http://localhost:11434/v1",
        api_key='ollama'
    )

    return generate.json(model, Class)

def monster_fusion(monster1: Monster, monster2: Monster) -> Monster:

    generator = ollama()

    result = generator(
        "Generate a new species of monster that is a fusion of two existing monsters. "
        f"Monster 1: {monster1}\n"
        f"Monster 2: {monster2}\n\n"
        "The new monster should have a fitting name and statistics creatively combining the attributes of both monsters."
    )
    return result

# def create_monster(prompt = "Generate a monster with unique attributes."):
#     generator = ollama()
#     result = generator(prompt)
#     return result

def battle_monster(monster1: Monster, monster2: Monster):

    generator = ollama(BattleReport)

    result = generator(
        "Generate a battle report between two monsters. "
        f"Monster 1: {monster1}\n"
        f"Monster 2: {monster2}\n\n"
        "Describe the battle outcome, including any special abilities used and the final winner."
    )
    return result


# fusions
for i in range(6):
    # randomly select two monsters
    monster1 = random.choice(monsters)
    monster2 = random.choice(monsters)
    print(f"Fusion of {monster1.name} and {monster2.name}:")
    new_monster = monster_fusion(monster1, monster2)
    monsters.append(new_monster)
    print(new_monster)
    print("\n" + "="*50 + "\n")

# Battle between two monsters
for i in range(6):
    # randomly select two monsters
    monster1 = random.choice(monsters)
    monster2 = random.choice(monsters)
    print(f"Battle between {monster1.name} and {monster2.name}:")
    battle_report = battle_monster(monster1, monster2)
    print(battle_report)
    print("\n" + "="*50 + "\n")

# Save the monsters to a file
with open("monsters.json", "w") as f:
    for monster in monsters:
        f.write(monster.model_dump_json(indent=2) + "\n\n")