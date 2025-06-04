import { auth, firestore } from '@/app/api/firebaseServer';
import { doc, getDoc } from 'firebase/firestore';

import { fetchId, putMonster } from '@/app/api/monsters/monsters';
import type { MonsterSimple, Monster } from '@/types/monster';

const FLASK_BASE_URL = (process.env.FLASK_BASE_URL || "http://localhost:5000") + "/fusion";

export async function POST(req: Request) {

    let uid = "";
    // Check if the request is authenticated
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }
        const idToken = authHeader.split(' ')[1];
        const decodedToken = await auth.verifyIdToken(idToken);
        uid = decodedToken.uid;
    } catch (error) {
        console.error("Authentication error:", error);
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    if (!uid || uid === "") {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        // Parse the request body
        const body = await req.json();
        const { monsterId1, monsterId2 } = body;

        if (!monsterId1 || !monsterId2) {
            return new Response(JSON.stringify({ error: "Both monsterId1 and monsterId2 are required" }), { status: 400 });
        }

        // Check if a monster with the given parent IDs already exists
        const fusionId1 = `${monsterId1}-${monsterId2}`;
        const fusionId2 = `${monsterId2}-${monsterId1}`;

        const parent1DocRef = await firestore.collection('monsters').where('fusionId', '==', fusionId1).get();
        const parent2DocRef = await firestore.collection('monsters').where('fusionId', '==', fusionId2).get();

        if (!parent1DocRef.empty || !parent2DocRef.empty) {
            const existingMonster = parent1DocRef.empty ? parent2DocRef.docs[0] : parent1DocRef.docs[0];
            // If a monster already exists, return it
            const monster = existingMonster.data() as Monster;
            return new Response(JSON.stringify(monster), { status: 200 });
        }

        // Fetch the monsters from the database
        const monster1 = await fetchId(monsterId1);
        const monster2 = await fetchId(monsterId2);

        // Prepare the data to send to the Flask API
        const fusionData = {
            monster1: monster1 as MonsterSimple,
            monster2: monster2 as MonsterSimple,
        };

        // Send the fusion data to the Flask API
        const response = await fetch(`${FLASK_BASE_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fusionData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return new Response(JSON.stringify({ error: errorText }), { status: response.status });
        }

        const fusionResult = await response.json() as MonsterSimple;

        // Save the new fused monster to the database
        const newMonster = await putMonster(fusionResult, uid, monster1.id, monster2.id);

        // Return the new fused monster
        return new Response(JSON.stringify(newMonster), { status: 200 });
    } catch (error: any) {
        console.error("Error in battle API:", error);
        if (error.message === "Monster not found") {
            return new Response(JSON.stringify({ error: "One or both monsters not found" }), { status: 404 });
        } else if (error instanceof SyntaxError) {
            return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
        }
        console.error("Error in fusion API:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}