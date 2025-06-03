import { fetchId } from '@/app/api/monsters/monsters';
import type { MonsterSimple } from '@/types/monster';

const FLASK_BASE_URL = (process.env.FLASK_BASE_URL || "http://localhost:5000") + "/battle";

export async function POST(req: Request) {
    console.log("Received POST request to /api/battle => ", FLASK_BASE_URL);
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
        // Return the battle result
        return new Response(JSON.stringify(battleResult), { status: 200 });
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