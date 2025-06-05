'use client';

import { useParams } from 'next/navigation';
import { useMonsters } from '@/context/monsters/monsterContext';
import MonsterCard from '@/components/card/monsterCard';
import { Box } from '@mui/material';

export default function Page() {
    const params = useParams();
    const id = params?.id as string;

    const { getMonster } = useMonsters();
    const monster = getMonster(parseInt(id));

    if (!id || !monster) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</Box>;
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            {monster ? <MonsterCard monster={monster} /> : <div>Loading...</div>}
        </Box>
    );
}
