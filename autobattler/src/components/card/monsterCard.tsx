'use client';
import { Card, CardContent, Typography, CardMedia } from '@mui/material';
import { List, ListItem, Box } from '@mui/material';
import { useSelection } from '@/context/selection/selectionContext';
import { Monster } from '@/types/monster';
import { Stats } from '@/types/stats';

export default function MonsterCard({ monster, size = 'medium' }: { monster: Monster; size?: 'small' | 'medium' | 'large' }) {
    const { setMonster1, setMonster2 } = useSelection();

    if (monster.image === "") {
        monster.image = '/placeholder.png'; // Fallback image if none provided
    }

    let sizeW;
    switch (size) {
        case 'small':
            sizeW = 250;
            break;
        case 'medium':
            sizeW = 300;
            break;
        case 'large':
            sizeW = 400;
            break;
        default:
            sizeW = 500; // Default to medium size
    }

    return (
        <Card sx={{ width: sizeW, margin: 0.5 }} onClick={() => { setMonster1(monster); }} onContextMenu={(e) => { e.preventDefault(); setMonster2(monster); }}>
            <Box sx={{ display: 'flex', alignItems: 'center',    borderBottom: '1px solid var(--color-secondary)' }}>
                <CardMedia
                    component="img"
                    height="50"
                    image={monster.image}
                    alt={monster.name}
                    sx={{ objectFit: 'contain', width: '50%' }}
                />
                <Box sx={{ textAlign: 'center', width: '50%' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--color-text)' }} noWrap>
                        {monster.name}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: 'var(--color-text)' }}>
                        {monster.ability}
                    </Typography>
                </Box>
            </Box>
            <CardContent sx={{ padding: '8px' }}>
                <Box sx={{ maxHeight: '120px', overflowY: 'auto' }}>
                    <p>{monster.description}</p>
                </Box>
                <List
                    dense
                    sx={{
                        padding: 0
                    }}
                >
                    {Object.entries(monster.stats as Stats).map(([key, value]) => (
                        <ListItem
                            key={key}
                            disableGutters
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                paddingY: '1px',
                                paddingX: 0,
                                minHeight: 0,
                            }}
                        >
                            <Typography sx={{ textAlign: 'left', color: 'var(--color-text)' }}>
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Typography>
                            <Typography sx={{ textAlign: 'right', color: 'var(--color-text)' }}>
                                {value.toString()}
                            </Typography>
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
}