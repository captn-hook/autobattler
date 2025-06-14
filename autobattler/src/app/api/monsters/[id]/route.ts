import { fetchId } from "../monsters";
import type { Monster } from "@/types/monster";

 
export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        // Convert the URL path to an integer ID, return 400 if invalid
        const monsterId = parseInt(url.pathname.split('/').pop() || '');

        if (isNaN(monsterId)) {
            return new Response(JSON.stringify({ error: "Invalid monster ID" }), { status: 400 });
        }
        try {
            const m = await fetchId(monsterId);
            if (!m) {
                throw new Error("Monster not found");
            }
            const monster: Monster = m as Monster;
            return new Response(JSON.stringify(monster), { status: 200 });
        } catch (error: any) {
            if (error.message === "Monster not found") {
                console.warn(`Monster with ID ${monsterId} not found`);
                return new Response(JSON.stringify({ error: "Monster not found" }), { status: 404 });
            }
            console.error("Error fetching monster by ID:", error);
            throw error; // Rethrow other errors
        }
    } catch (error: any) {
        console.error("Error fetching monster by ID:", error);
        if (error instanceof SyntaxError) {
            return new Response(JSON.stringify({ error: "Invalid request format" }), { status: 400 });
        }
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}