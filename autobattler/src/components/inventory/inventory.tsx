
import getFakeData from '@/components/fakeData';

import { Grid, Box } from '@mui/material';

import MonsterCard from '@/components/card/monsterCard';

export default function Inventory() {

    const fakeData = getFakeData(40);

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
                {fakeData.map((monster) => (
                    <MonsterCard key={monster.id} monster={monster} />
                ))}
            </Grid>
        </Box>
    );
}