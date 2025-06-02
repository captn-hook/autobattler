'use client';
import { AppBar, Toolbar, IconButton, Menu, Typography, Box } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import  ProfileIcon from '@mui/icons-material/Person';

import { useState } from 'react';

import Link from 'next/link';

export default function Nav() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static">
            <Toolbar sx={{ color: 'var(--color-text)', backgroundColor: 'var(--color-primary)' }}>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleMenuOpen}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Autobattler
                </Typography>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <IconButton
                            component={Link}
                            href="/"
                            color="inherit"
                            onClick={handleMenuClose}
                        >
                            <HomeIcon />
                        </IconButton>
                        <IconButton
                            component={Link}
                            href="/profile"
                            color="inherit"
                            onClick={handleMenuClose}
                        >
                            <ProfileIcon />
                        </IconButton>
                    </Box>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}