'use client';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import HoverCell from './hoverCell';
import { useEffect, useState } from 'react';
import { Monster } from '@/types/monster';
import { useResult } from '@/context/result/resultContext';

export default function Index() {
    const [data, setData] = useState<Monster[]>([]);
    const { result } = useResult();
    
    useEffect(() => {
        // Fetch /api/monsters
        async function fetchMonsters() {
            try {
                const response = await fetch('/api/monsters');
                if (!response.ok) {
                    console.warn('Failed to fetch monsters:', response.statusText);
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
        <TableContainer>
            <Table sx={{
                color: 'var(--color-text)',
                backgroundColor: 'var(--color-background)',
            }}>
                <TableHead>
                    <TableRow sx={{
                            borderBottom: '1px solid var(--color-secondary)'
                        }}>
                        <TableCell>ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Image</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Ability</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((monster) => (
                        <TableRow key={monster.id} sx={{
                            borderBottom: '1px solid var(--color-secondary)'
                        }}>
                            <TableCell>{monster.id}</TableCell>
                            <TableCell>{monster.name}</TableCell>
                            <HoverCell stats={monster.stats}>
                                <img src={monster.image == "" ? "/placeholder.png" : monster.image} alt={monster.name} style={{ width: '50px', height: '50px' }} />
                            </HoverCell>
                            <TableCell>{monster.description}</TableCell>
                            <TableCell>{monster.ability}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </ TableContainer >
    );
}