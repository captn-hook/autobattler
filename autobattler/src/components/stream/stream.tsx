'use client';
import { Box } from '@mui/material';
import MonsterCard from '@/components/card/monsterCard';
import { useResult } from '@/context/result/resultContext';
import { useMonsters } from '@/context/monsters/monsterContext';

export default function Stream() {
    const { result } = useResult();
    const { getMonsters } = useMonsters();

    const monsters = getMonsters()


    if (!monsters || monsters.length === 0) {
        return <Box sx={{ width: '100%', height: '100%' }}>Loading...</Box>;
    }
    
    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <h2>Newest Monsters</h2>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'nowrap',
                    overflowX: 'auto',
                    gap: 2,
                    p: 2,
                    '&::-webkit-scrollbar-thumb': {
                        borderRadius: '10px',
                        backgroundColor: 'var(--color-text)',
                    },
                    '&::-webkit-scrollbar': {
                        height: '3px',
                    },
                    marginBottom: '16px',
                }}
            >
                {monsters.map((monster) => (
                    <Box key={monster.id} sx={{ flexShrink: 0 }}>
                        <MonsterCard monster={monster} />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
