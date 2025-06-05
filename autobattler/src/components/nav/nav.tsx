'use client';
import { AppBar, Toolbar, IconButton, Typography, Box, Button } from '@mui/material';
import Image from 'next/image';
import ProfileIcon from '@/components/user/ProfileIcon';
import LoginIcon from '@mui/icons-material/Login';
import { useUser } from '@/context/user/userContext';
import { useSelection } from '@/context/selection/selectionContext';
import { useResult } from '@/context/result/resultContext';
import { auth } from '@/app/firebaseConfig';
import Link from 'next/link';

export default function Nav() {
    const { user, login, logout } = useUser();
    const { selection } = useSelection();
    const { result, setResult } = useResult();

    
    const handleFetchWithAuth = async (url: string, body: object) => {
        try {
            const currentUser = auth.currentUser;

            if (!currentUser) {
                console.error('User is not authenticated');
                return;
            }

            const token = await currentUser.getIdToken(); // Get Firebase Auth token

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Include token in Authorization header
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return await response.json();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <AppBar position="static">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                            Autobattler
                        </Link>
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {!selection.monster1 && !selection.monster2 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 8px' }}>
                            <Typography variant="subtitle1" sx={{ color: 'var(--color-text)' }}>
                                Login to battle or fuse
                            </Typography>
                            <Typography variant="subtitle1" sx={{ color: 'var(--color-text)' }}>
                                by left/right clicking monsters
                            </Typography>
                        </Box>
                    )}

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
                            />
                        </>
                    )}
                    {selection.monster1 && selection.monster2 && user && (
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
                                    // Set loading
                                    console.log('Starting battle between', selection.monster1.name, 'and', selection.monster2.name);
                                    handleFetchWithAuth('/api/battle', {
                                        monsterId1: selection.monster1.id,
                                        monsterId2: selection.monster2.id,
                                    }).then((data) => {
                                        console.log('Battle result:', data);
                                    }).catch((error) => {
                                        console.error('Error during battle:', error);
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
                                    console.log('Fusing monsters', selection.monster1.name, 'and', selection.monster2.name);
                                    handleFetchWithAuth('/api/fusion', {
                                        monsterId1: selection.monster1.id,
                                        monsterId2: selection.monster2.id,
                                    }).then((data) => {
                                        console.log('Fusion result:', data);
                                        setResult(data);
                                    }).catch((error) => {
                                        console.error('Error during fusion:', error);
                                    });
                                }}>
                                X
                            </Button>
                        </Box>
                    )}
                    {selection.monster1 && selection.monster2 && !user && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 8px' }}>
                            <Typography variant="subtitle1" sx={{ color: 'var(--color-text)' }}>
                                Login to battle
                            </Typography>
                            <Typography variant="subtitle1" sx={{ color: 'var(--color-text)' }}>
                                or fuse monsters
                            </Typography>
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