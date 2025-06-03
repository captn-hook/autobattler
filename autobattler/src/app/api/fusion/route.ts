import { fetchId, putMonster } from '@/app/api/monsters/monsters';
import type { MonsterSimple } from '@/types/monster';

const FLASK_BASE_URL = (process.env.FLASK_BASE_URL || "http://localhost:5000") + "/fusion";

export async function POST(req: Request) {
    console.log("Received POST request to /api/fusion");
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
        const newMonster = await putMonster(fusionResult);

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