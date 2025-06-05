import { firestore } from "@/app/api/firebaseServer";
import { putMonster } from './monsters';
import type { Monster } from '@/types/monster';

// GET /api/monsters
export async function GET(req: Request) {
    try {
        const url = new URL(req.url || '');
        const sort = url.searchParams.get('sort');

        let monsters = await firestore.collection("monsters").get();

        if (monsters.empty) {
            return new Response(JSON.stringify([]), { status: 200 });
        } 
        
        let data = monsters.docs.map(doc => doc.data() as Monster);

        // order by id
        data.sort((a, b) => b.id - a.id);

        // get the 30 most recent
        const recentMonsters = data.slice(0, 30);

        return new Response(JSON.stringify(recentMonsters), { status: 200 });
    } catch (error) {
        console.error("Error fetching monsters:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
// // POST /api/monsters
// export async function POST(req: Request) {
//     try {
//         const monsterData: Monster = await req.json();
//         if (!monsterData || !monsterData.name || !monsterData.stats || !monsterData.ability  || !monsterData.fusionId || !monsterData.level) {
//             return new Response(JSON.stringify({ error: "Invalid monster data" }), { status: 400 });
//         }
//         const newMonster = await putMonster(monsterData, monsterData.owner, parseInt(monsterData.fusionId.split('-')[0]), parseInt(monsterData.fusionId.split('-')[1]), monsterData.level);
//         return new Response(JSON.stringify(newMonster), { status: 201 });
//     } catch (error: any) {
//         console.error("Error creating monster:", error);
//         if (error.message === "Monster already exists") {
//             return new Response(JSON.stringify({ error: "Monster already exists" }), { status: 409 });
//         }
//         return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
//     }
// }