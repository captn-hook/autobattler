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
    INVISIBLE = "INVISIBILITY",
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
    TIME_SHIFT = "TIME_SHIFT",
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
    OMNISCIENCE = "OMNISCIENCE"
}

export  type Monster = {
    id: number;
    name: string;
    description: string;
    stats: Stats;
    ability: Ability;
    image: string;
}