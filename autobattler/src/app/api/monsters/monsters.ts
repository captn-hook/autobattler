import { setDoc, getDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "@/app/api/firebaseServer";
import type { Monster, MonsterSimple } from '@/types/monster';

export async function fetchId(monsterId: number) {
    const data = await firestore.collection("monsters").doc(monsterId.toString()).get();
    if (data.exists) {
        const monsterData = data.data();
        return monsterData as Monster;
    } else {
        throw new Error("Monster not found");
    }
}

export async function fetchName(name: string) {
    const data = await firestore.collection("monsters").where("name", "==", name).get();
    if (data.empty) {
        throw new Error("Monster not found");
    }
    // There should only be one monster with a given name, so we can return the first one
    const monsterData = data.docs[0].data();
    return monsterData as Monster;
}

export function getNextId() {
    // get the length of the monsters collection and add 1 to it
    return firestore.collection("monsters").get().then(snapshot => {
        return snapshot.size;
    });
}

export async function putMonster(monster: MonsterSimple, owner: string, pid1: number, pid2: number, level: number = 1) {
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
        createdAt: new Date().toISOString(),
        owner: owner, 
        fusionId: `${pid1}-${pid2}`, 
        wins: [],
        losses: [],
        level: level,
    };

    // Add the monster to the database
    await firestore.collection("monsters").doc(id.toString()).set(newMonster);
    
    // Add the monster to the user's favorites collection
    const userDoc = await firestore.collection("users").doc(owner).get();
    if (userDoc.exists) {
        const userData = userDoc.data();
        const favorites = userData?.favorites || [];
        
        // Check if the monster is already in the favorites
        if (!favorites.includes(id)) {
            favorites.push(id);
            await firestore.collection("users").doc(owner).update({ favorites: favorites });
        }
    } else {
        // If the user document doesn't exist, create it with the new monster as a favorite
        await firestore.collection("users").doc(owner).set({
            favorites: [id]
        });
    }
    
    return newMonster;
}