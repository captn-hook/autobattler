import { auth, firestore } from '@/app/api/firebaseServer';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { fetchId } from '@/app/api/monsters/monsters';
import type { MonsterSimple, BattleReport } from '@/types/monster';

const FLASK_BASE_URL = (process.env.FLASK_BASE_URL || "http://localhost:5000") + "/battle";

export async function POST(req: Request) {

    // Check if the request is authenticated
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }
        const idToken = authHeader.split(' ')[1];
        await auth.verifyIdToken(idToken);
    } catch (error) {
        console.error("Authentication error:", error);
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        // Parse the request body
        const body = await req.json();
        const { monsterId1, monsterId2 } = body;

        if (!monsterId1 || !monsterId2) {
            return new Response(JSON.stringify({ error: "Both monsterId1 and monsterId2 are required" }), { status: 400 });
        }
        
        // Fetch the monsters from the database
        const monster1 = await fetchId(monsterId1);
        const monster2 = await fetchId(monsterId2);

        // Check if the battle report already exists
        const battleId1 = monster1.id + "-" + monster2.id;
        const battleId2 = monster2.id + "-" + monster1.id;

        const battleDoc1 = await firestore.doc(`battles/${battleId1}`).get();
        const battleDoc2 = await firestore.doc(`battles/${battleId2}`).get();       


        if (battleDoc1.exists || battleDoc2.exists) {
            const existingBattle = battleDoc1.exists ? battleDoc1.data() : battleDoc2.data();
            if (existingBattle) {
                return new Response(JSON.stringify(existingBattle as BattleReport), { status: 200 });
            }
        }
        
        // Prepare the data to send to the Flask API
        const battleData = {
            monster1: monster1 as MonsterSimple,
            monster2: monster2 as MonsterSimple,
        };

        // Send the battle data to the Flask API
        const response = await fetch(`${FLASK_BASE_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(battleData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return new Response(JSON.stringify({ error: errorText }), { status: response.status });
        }
        const battleResult = await response.json();
        
        if (!battleResult || !battleResult.name || !battleResult.description) {
            return new Response(JSON.stringify({ error: "Invalid response from battle API" }), { status: 500 });
        }

        const winner = battleResult.name === monster1.name ? monster1.id : monster2.id;
        const BattleReport = {
            winner: winner,
            loser: winner === monster1.id ? monster2.id : monster1.id,
            description: battleResult.description,
            createdAt: new Date().toISOString(),
            id: monster1.id + "-" + monster2.id
        } as BattleReport;

        // Write to the database 
        await firestore.doc(`battles/${BattleReport.id}`).set(BattleReport);
    
        // Update the monsters' win/loss records
        if (winner === monster1.id) {
            monster1.wins.push(BattleReport.id);
            monster2.losses.push(BattleReport.id);
        } else {
            monster2.wins.push(BattleReport.id);
            monster1.losses.push(BattleReport.id);
        }

        await firestore.doc(`monsters/${monster1.id}`).set(monster1);
        await firestore.doc(`monsters/${monster2.id}`).set(monster2);    

        // Return the battle result
        return new Response(JSON.stringify(BattleReport), { status: 200 });
    } catch (error: any) {
        console.error("Error in battle API:", error);
        if (error.message === "Monster not found") {
            console.warn("One or both monsters not found:", error);
            return new Response(JSON.stringify({ error: "One or both monsters not found" }), { status: 404 });
        } else if (error instanceof SyntaxError) {
            return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
        }
        console.error("Error in battle API:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}