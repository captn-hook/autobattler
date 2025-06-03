'use client';
import { AppBar, Toolbar, IconButton, Typography, Box, Button } from '@mui/material';
import Image from 'next/image';
import ProfileIcon from '@/components/user/ProfileIcon';
import LoginIcon from '@mui/icons-material/Login';
import { useUser } from '@/context/user/userContext';
import { useSelection } from '@/context/selection/selectionContext';
import { useResult } from '@/context/result/resultContext';

export default function Nav() {
    const { user, login, logout, addFavorite } = useUser();
    const { selection } = useSelection();
    const { result, setResult } = useResult();

    return (
        <AppBar position="static">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Autobattler
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {selection.monster1 && (
                        <>
                            <Typography variant="subtitle1" sx={{ marginRight: 1, color: 'var(--color-text)' }}>
                                {selection.monster1.name}
                            </Typography>
                            <Image
                                src={selection.monster1.image}
                                alt={`Monster ${selection.monster1}`}
                                width={40}
                                height={40}
                                style={{ borderRadius: '50%' }}
                            />
                        </>
                    )}
                    {selection.monster1 && selection.monster2 && (
                        // Stack vs and x button vertically
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 8px' }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                sx={{ marginBottom: 1, padding: '4px 8px', fontSize: '0.75rem' }}
                                onClick={() => {
                                    if (!selection.monster1 || !selection.monster2) {
                                        console.error('Both monsters must be selected for battle');
                                        return;
                                    }
                                    // Handle vs click
                                    fetch('/api/battle', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            monsterId1: selection.monster1.id,
                                            monsterId2: selection.monster2.id,
                                        }),
                                    })
                                        .then((response) => {
                                            if (!response.ok) {
                                                throw new Error('Network response was not ok');
                                            }
                                            return response.json();
                                        })
                                        .then((data) => {
                                            setResult(data);
                                        })
                                        .catch((error) => {
                                            console.error('Error:', error);
                                        });
                                }}>
                                VS
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                sx={{ padding: '4px 8px', fontSize: '0.75rem' }}
                                onClick={() => {
                                    // Handle fusion click
                                    if (!selection.monster1 || !selection.monster2) {
                                        console.error('Both monsters must be selected for fusion');
                                        return;
                                    }
                                    fetch('/api/fusion', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            monsterId1: selection.monster1.id,
                                            monsterId2: selection.monster2.id,
                                        }),
                                    })
                                        .then((response) => {
                                            if (!response.ok) {
                                                console.warn('Failed to fuse monsters:', response.statusText);
                                                return response.json();
                                            }
                                            return response.json();
                                        })
                                        .then((data) => {
                                            setResult(data).then((r) => {
                                                if (r && r.id) {
                                                    addFavorite?.(r.id);
                                                }
                                            });
                                        });
                                }}>
                                X
                            </Button>
                        </Box>
                    )}
                    {selection.monster2 && (
                        <>
                            <Image
                                src={selection.monster2.image}
                                alt={`Monster ${selection.monster2}`}
                                width={40}
                                height={40}
                            />
                            <Typography variant="subtitle1" sx={{ marginLeft: 1, color: 'var(--color-text)' }}>
                                {selection.monster2.name}
                            </Typography>
                        </>
                    )}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {user ? (
                        <IconButton
                            color="inherit"
                            onClick={logout}
                        >
                            <ProfileIcon />
                        </IconButton>
                    ) : (
                        <IconButton
                            color="inherit"
                            onClick={() => {
                                login();
                            }}>
                            <LoginIcon />
                        </IconButton>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}