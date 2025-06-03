'use client';
import { useEffect, useState } from 'react';
import { Monster } from '@/types/monster';
import { Grid, Box } from '@mui/material';
import { useResult } from '@/context/result/resultContext';
import { useUser } from '@/context/user/userContext';
import MonsterCard from '@/components/card/monsterCard';

export default function Inventory() {
    const [data, setData] = useState<Monster[]>([]);
    const { result } = useResult();
    const { user } = useUser();
    
    useEffect(() => {
        // Fetch /api/monsters?filter=uuid
        async function fetchMonsters() {
            if (!user?.id) {
                console.warn('User ID is not available, skipping fetch');
                return;
            }
            try {
                const response = await fetch('/api/monsters?filter=' + user?.id);
                if (!response.ok) {
                    console.warn('Failed to fetch monsters:', response.statusText);
                    return;
                }
                const monsters = await response.json();
                setData(monsters);
            } catch (error) {
                console.error('Error fetching monsters:', error);
            }
        }
        fetchMonsters();
    }, [result, user]);


    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'left',
            justifyContent: 'center',
        }}>
            <h2>Inventory</h2>
            <Grid container spacing={2} justifyContent="center" sx={{
                flexDirection: 'row',
                alignItems: 'stretch',
                height: '100%',
                width: '100%',
                overflowY: 'scroll',
                direction: 'rtl',
                '&::-webkit-scrollbar-thumb': {
                    borderRadius: '10px',
                    backgroundColor: 'var(--color-text)',
                },
                '&::-webkit-scrollbar': {
                    width: '3px',
                },
            }}>
                {data.map((monster) => (
                    <MonsterCard key={monster.id} monster={monster} />
                ))}
            </Grid>
        </Box>
    );
}