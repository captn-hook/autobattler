'use client';
import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import MonsterCard from '@/components/card/monsterCard';
import { Monster } from '@/types/monster';
import { useResult } from '@/context/result/resultContext';

export default function Stream() {
    const [data, setData] = useState<Monster[]>([]);
    const { result } = useResult();
    
    useEffect(() => {
        // Fetch /api/monsters
        async function fetchMonsters() {
            try {
                const response = await fetch('/api/monsters');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const monsters = await response.json();
                setData(monsters);
            } catch (error) {
                console.error('Error fetching monsters:', error);
            }
        }
        fetchMonsters();
    }, [result]);

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
                {data.map((monster) => (
                    <Box key={monster.id} sx={{ flexShrink: 0 }}>
                        <MonsterCard monster={monster} />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
