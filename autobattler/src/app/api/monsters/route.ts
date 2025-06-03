import { orderBy, collection, query, where, getDocs, limit, documentId } from "firebase/firestore";
import { firestore } from "@/app/firebaseConfig";
import { fetchId, putMonster } from './monsters';
import type { MonsterSimple } from '@/types/monster';

function isValidSortField(sort: string | string[] | undefined): boolean {
    const validSortFields = ['id', 'name', 'recency'];
    return typeof sort === 'string' && validSortFields.includes(sort);
}

// GET /api/monsters
export async function GET(req: Request) {
    try {
        const url = new URL(req.url || '');
        const id = url.searchParams.get('id');
        const sort = url.searchParams.get('sort');
        const filter = url.searchParams.get('filter');

        let monstersRef = collection(firestore, "monsters");
        let monstersQuery;

        if (id) {
            const monsterId = parseInt(id);
            if (isNaN(monsterId)) {
                return new Response(JSON.stringify({ error: "Invalid monster ID" }), { status: 400 });
            }
            try {
                const monster = await fetchId(monsterId);
                return new Response(JSON.stringify(monster), { status: 200 });
            } catch (error: any) {
                if (error.message === "Monster not found") {
                    console.warn(`Monster with ID ${monsterId} not found`);
                    return new Response(JSON.stringify({ error: "Monster not found" }), { status: 404 });
                }
                throw error; // Rethrow other errors
            }
        } else if (filter) {
            const userId = filter;
            if (!userId) {
                return new Response(JSON.stringify({ error: "Invalid user ID" }), { status: 400 });
            }
            const userMonstersRef = collection(firestore, "users", userId, "monsters");
            const userMonstersSnapshot = await getDocs(userMonstersRef);
            const userMonsterIds = userMonstersSnapshot.docs.map(doc => doc.id);
            if (userMonsterIds.length === 0) {
                return new Response(JSON.stringify([]), { status: 200 });
            }
            monstersQuery = query(monstersRef, where(documentId(), 'in', userMonsterIds));
        } else {
            if (sort && isValidSortField(sort)) {
                if (sort === 'id') {
                    monstersQuery = query(monstersRef, orderBy('id'));
                } else if (sort === 'name') {
                    monstersQuery = query(monstersRef, orderBy('name'));
                } else if (sort === 'recency') {
                    monstersQuery = query(monstersRef, orderBy('createdAt', 'desc'));
                }
            }
        }

        if (!monstersQuery) {
            monstersQuery = query(monstersRef, orderBy('createdAt', 'desc'));
        }
        monstersQuery = query(monstersQuery, limit(30));
        const monstersSnapshot = await getDocs(monstersQuery);
        const monsters = monstersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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