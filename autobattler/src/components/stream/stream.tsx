import getFakeData from '@/components/fakeData';
import { Box } from '@mui/material';
import MonsterCard from '@/components/card/monsterCard';

export default function Stream() {
    const fakeData = getFakeData(40);

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
                {fakeData.map((monster) => (
                    <Box key={monster.id} sx={{ flexShrink: 0 }}>
                        <MonsterCard monster={monster} />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
