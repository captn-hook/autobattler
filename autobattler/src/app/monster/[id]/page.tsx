'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useMonsters } from '@/context/monsters/monsterContext';
import MonsterCard from '@/components/card/monsterCard';
import { Box } from '@mui/material';
import type { Monster } from '@/types/monster';

export default function Page() {
    const params = useParams();
    const id = params?.id as string;
    const [monster, setMonster] = useState<Monster | null>(null);

    const { getMonster } = useMonsters();
    // const monster = await getMonster(parseInt(id));

    useEffect(() => {
        async function fetchMonster() {
            if (id) {
                try {
                    const monsterData = await getMonster(parseInt(id));
                    if (monsterData) {
                        setMonster(monsterData);
                    }
                } catch (error) {
                    console.error('Error fetching monster:', error);
                }
            }
        }
        fetchMonster();
    }, []);
    

    if (!id || !monster) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</Box>;
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            {monster ? <MonsterCard monster={monster} /> : <div>Loading...</div>}
        </Box>
    );
}