import { orderBy, collection, query, where, getDocs, limit, documentId } from "firebase/firestore";
import { firestore } from "@/app/firebaseConfig";
import { fetchId, putMonster } from './monsters';
import type { MonsterSimple, Monster } from '@/types/monster';

function isValidSortField(sort: string | string[] | undefined): boolean {
    const validSortFields = ['id', 'name', 'recency'];
    return typeof sort === 'string' && validSortFields.includes(sort);
}

// GET /api/monsters
export async function GET(req: Request) {
    try {
        const url = new URL(req.url || '');
        const sort = url.searchParams.get('sort');

        let monstersRef = collection(firestore, "monsters");
        let monstersQuery;

        if (sort && isValidSortField(sort)) {
            if (sort === 'id') {
                monstersQuery = query(monstersRef, orderBy('id'));
            } else if (sort === 'name') {
                monstersQuery = query(monstersRef, orderBy('name'));
            } else if (sort === 'recency') {
                monstersQuery = query(monstersRef, orderBy('createdAt', 'desc'));
            }
        }


        if (!monstersQuery) {
            monstersQuery = query(monstersRef, orderBy('createdAt', 'desc'));
        }
        monstersQuery = query(monstersQuery, limit(30));
        const monstersSnapshot = await getDocs(monstersQuery);
        const monsters = monstersSnapshot.docs.map(doc => {
            const data = doc.data() as Monster;
            return data as Monster;
        })
        console.log("Fetched monsters:", monsters);
        return new Response(JSON.stringify(monsters), { status: 200 });
    } catch (error) {
        console.error("Error fetching monsters:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}

// POST /api/monsters
export async function POST(req: Request) {
    try {
        const monsterData: MonsterSimple = await req.json();
        if (!monsterData || !monsterData.name || !monsterData.stats) {
            return new Response(JSON.stringify({ error: "Invalid monster data" }), { status: 400 });
        }
        const newMonster = await putMonster(monsterData);
        return new Response(JSON.stringify(newMonster), { status: 201 });
    } catch (error: any) {
        console.error("Error creating monster:", error);
        if (error.message === "Monster already exists") {
            return new Response(JSON.stringify({ error: "Monster already exists" }), { status: 409 });
        }
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}