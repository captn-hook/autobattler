'use client';
import { Card, CardContent, Typography, CardMedia } from '@mui/material';
import { List, ListItem, Box, useMediaQuery } from '@mui/material';
import { useSelection } from '@/context/selection/selectionContext';
import { Monster } from '@/types/monster';
import { Stats } from '@/types/stats';

const image_list = [
    'air',
    'earth',
    'earthquake',
    'fire',
    'fish',
    'fly',
    'heal',
    'stun',
    'water',
    'divine',
    'invisible',
    'dog',
    'blind',
    'charm',
    'wrath',
    'camouflage',
    'shield'
];

export default function MonsterCard({ monster }: { monster: Monster }) {
    const { setMonster1, setMonster2 } = useSelection();

        const isSmallScreen = useMediaQuery('(max-width:600px)');
        const isMediumScreen = useMediaQuery('(max-width:100px)');
        let sizeW = '350px'; 
        let fontS = '0.5rem'; 
        let fontL = '0.8rem';
    
        if (isSmallScreen) {
            console.log('Small screen detected');
            sizeW = '180px'; 
            fontS = '0.4rem'; 
            fontL = '0.6rem';
        } else if (isMediumScreen) {
            console.log('Medium screen detected');
            sizeW = '230px'; 
            fontS = '0.45rem'; 
            fontL = '0.7rem'; 
        }

    if (monster.image === "") {
        if (image_list.includes(monster.ability.toLowerCase())) {
            monster.image = `/${monster.ability.toLowerCase()}.png`; // Use ability name for image
        } else {
            monster.image = '/placeholder.png'; // Fallback image if none provided
        }
    }
    

    function getColor(value: number): string {
        // Linear interpolation for color based on value
        // Red for low values, blue for high values
        const min = 0;
        const max = 100; 
        const ratio = (value - min) / (max - min);
        const r = Math.round(255 * (1 - ratio)); // Red decreases
        const b = Math.round(255 * ratio); // Blue increases
        return `rgb(${r}, 0, ${b})`; // Green is always 0
    }

    return (
        <Card sx={{
            width: sizeW,
            margin: 0.5,
            fontSize: fontS,
            direction: 'ltr !important',
        }} onClick={() => { setMonster1(monster); }} onContextMenu={(e) => { e.preventDefault(); setMonster2(monster); }}>
            <Box sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--color-secondary)' }}>
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
                <Box sx={{
                    height: '20vh',
                    overflowY: 'auto',
                    direction: 'ltr',
                    '&::-webkit-scrollbar-thumb': {
                        borderRadius: '10px',
                        backgroundColor: 'var(--color-text)',
                    },
                    '&::-webkit-scrollbar': {
                        width: '3px',
                    },
                    marginBottom: '8px',
                }}>
                    <Typography sx={{
                        textAlign: 'left',
                        color: 'var(--color-text)',
                        whiteSpace: 'pre-wrap',
                        fontSize: fontL,
                        lineHeight: '1.1rem',
                    }}
                    >{monster.description}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTop: 'thin solid var(--color-secondary)', paddingTop: '4px' }}>
                    <Typography variant="subtitle2" sx={{ color: 'var(--color-text)', marginBottom: '4px' }}>
                        Level: {monster.level}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ color: 'var(--color-text)', marginBottom: '4px' }}>
                        Parent Monsters: <a href={`/monster/${monster.fusionId.split('-')[0]}`}>{monster.fusionId.split('-')[0]}</a> / <a href={`/monster/${monster.fusionId.split('-')[1]}`}>{monster.fusionId.split('-')[1]}</a>
                    </Typography>
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
                                margin: 0,
                                minHeight: 0,
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    width: '100%',
                                    top: '0rem',
                                    borderBottom: 'thin solid var(--color-secondary)',
                                    backgroundColor: 'var(--color-secondary)',
                                }
                            }}
                        >
                            <Typography sx={{ textAlign: 'left', color: 'var(--color-text)', fontSize: fontL }}>
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Typography>
                            <Typography sx={{ textAlign: 'right', color: getColor(value), fontWeight: 'bold', fontSize: fontL }}>
                                {value.toString()}
                            </Typography>
                        </ListItem>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
}