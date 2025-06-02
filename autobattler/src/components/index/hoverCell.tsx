'use client';
import { useEffect, useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import type { Stats } from '@/types/stats';
import styles from './hoverCell.module.css';

export default function HoverCell({ children, stats }: { children: React.ReactNode; stats: Stats }) {
    const [hovered, setHovered] = useState(false);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [tooltipStyle, setTooltipStyle] = useState({ top: 0, left: 0 });

    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);
    const handleMouseMove = (event: React.MouseEvent) => {
        const tooltipWidth = 300;
        const tooltipHeight = 150;

        let left = event.clientX - tooltipWidth - 10;
        let top = event.clientY + 10;

        if (left < 0) left = event.clientX + 10;
        if (top + tooltipHeight > window.innerHeight) top = window.innerHeight - tooltipHeight - 10;

        setCursorPosition({ x: event.clientX, y: event.clientY });
        setTooltipStyle({ top, left });
    };

    return (
        <TableCell
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            className={styles.hoverCell}
            style={{ position: 'relative' }}
        >
            {children}
            {hovered && (
                <div
                    className={styles.subTable}
                    style={{
                        position: 'fixed',
                        top: tooltipStyle.top,
                        left: tooltipStyle.left,
                        zIndex: 1000,
                        backgroundColor: 'var(--color-background)',
                        border: '1px solid #ccc',
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                        padding: '10px',
                        pointerEvents: 'none',
                    }}
                >
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Health</TableCell>
                                    <TableCell>Defense</TableCell>
                                    <TableCell>Strength</TableCell>
                                    <TableCell>Intelligence</TableCell>
                                    <TableCell>Speed</TableCell>
                                    <TableCell>Magic</TableCell>
                                    <TableCell>Stealth</TableCell>
                                    <TableCell>Luck</TableCell>
                                    <TableCell>Charm</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>{stats.health}</TableCell>
                                    <TableCell>{stats.defense}</TableCell>
                                    <TableCell>{stats.strength}</TableCell>
                                    <TableCell>{stats.intelligence}</TableCell>
                                    <TableCell>{stats.speed}</TableCell>
                                    <TableCell>{stats.magic}</TableCell>
                                    <TableCell>{stats.stealth}</TableCell>
                                    <TableCell>{stats.luck}</TableCell>
                                    <TableCell>{stats.charm}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            )}
        </TableCell>
    );
}
