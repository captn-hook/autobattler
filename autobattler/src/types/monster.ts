import type { Stats } from "./stats";

export enum Ability {
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
    NATURE = "NATURE"
}

export  type Monster = {
    id: number;
    name: string;
    description: string;
    stats: Stats;
    ability: Ability;
    image: string;
    createdAt: string;
    owner: string; 
    fusionId: string;
    wins: string[];
    losses: string[];
    level: number;
}

export type MonsterSimple = {
    name: string;
    description: string;
    stats: Stats;
    ability: Ability;
}

export type BattleReport = {
    winner: number;
    loser: number;
    description: string;
    createdAt: string;
    id: string;
}

export type BattleReportSimple = {
    winner: number;
    loser: number;
    description: string;
}