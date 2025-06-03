import { setDoc, getDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "@/app/firebaseConfig";
import type { Monster, MonsterSimple } from '@/types/monster';

export async function fetchId(monsterId: number) {
    const monsterDoc = doc(firestore, "monsters", monsterId.toString());
    const monsterSnapshot = await getDoc(monsterDoc);
    if (monsterSnapshot.exists()) {
        const monsterData = monsterSnapshot.data();
        return monsterData as Monster;
    } else {
        throw new Error("Monster not found");
    }
}

export async function fetchName(name: string) {
    const monstersRef = collection(firestore, "monsters");
    const monstersQuery = query(monstersRef, where("name", "==", name));
    const monstersSnapshot = await getDocs(monstersQuery);
    if (monstersSnapshot.empty) {
        throw new Error("Monster not found");
    }
    // There should only be one monster with a given name, so we can return the first one
    const monsterData = monstersSnapshot.docs[0].data();
    return monsterData as Monster;
}

export function getNextId() {
    // get the length of the monsters collection and add 1 to it
    const monstersRef = collection(firestore, "monsters");
    return getDocs(monstersRef).then(snapshot => snapshot.size + 1);
}

export async function putMonster(monster: MonsterSimple) {
    // check if the monster already exists under that name
    try {
        const existingMonster = await fetchName(monster.name);
        if (existingMonster) {
            return existingMonster; 
        }
    } catch (error: any) {
        if (error.message !== "Monster not found") {
            throw error;
        }
    }
    const id = await getNextId();
    const newMonster: Monster = {
        id: id,
        name: monster.name,
        description: monster.description,
        stats: monster.stats,
        ability: monster.ability,
        image: "",
        createdAt: new Date().toISOString()
    };

    // Add the monster to the database
    const monsterDoc = doc(firestore, "monsters", id.toString());
    await setDoc(monsterDoc, newMonster);
    return newMonster;
}