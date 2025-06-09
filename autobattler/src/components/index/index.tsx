'use client';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import HoverCell from './hoverCell';
import { useEffect, useState } from 'react';
import { Monster } from '@/types/monster';
import { useResult } from '@/context/result/resultContext';

interface SortMethod {
    field: keyof Monster;
    order: 'asc' | 'desc';
}

function sortIcon(sortMethod: SortMethod, thisField: keyof Monster) {
    if (sortMethod.field !== thisField) return '   ';
    return sortMethod.order === 'asc' ? ' ▲' : ' ▼';
}
    

export default function Index() {
    const [data, setData] = useState<Monster[]>([]);
    const { result } = useResult();
    const [sortMethod, setSortMethod] = useState<SortMethod>({ field: 'id', order: 'asc' });
    
    useEffect(() => {
        // Fetch /api/monsters
        async function fetchMonsters() {
            try {
                const response = await fetch('/api/monsters');
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
    }, [result]);

    const sortData = (field: keyof Monster) => {
        // When the same field is clicked, toggle the order
        // When a different field is clicked, reset to ascending order
        setSortMethod(prev => {
            const newOrder = prev.field === field && prev.order === 'asc' ? 'desc' : 'asc';
            return { field, order: newOrder };
        });
        setData(prevData => {
            const sortedData = [...prevData].sort((a, b) => {
                if (a[field] < b[field]) return sortMethod.order === 'asc' ? -1 : 1;
                if (a[field] > b[field]) return sortMethod.order === 'asc' ? 1 : -1;
                return 0;
            });
            return sortedData;
        });
    }

    return (
        <TableContainer>
            <Table sx={{
                color: 'var(--color-text)',
                backgroundColor: 'var(--color-background)',
            }}>
                <TableHead>
                    <TableRow sx={{
                            borderBottom: '1px solid var(--color-secondary)',
                            whiteSpace: 'nowrap',
                        }}>
                        <TableCell onClick={() => sortData('id')}>ID{sortIcon(sortMethod, 'id')}</TableCell>
                        <TableCell onClick={() => sortData('name')}>Name{sortIcon(sortMethod, 'name')}</TableCell>
                        <TableCell>Image</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell onClick={() => sortData('ability')}>Ability{sortIcon(sortMethod, 'ability')}</TableCell>
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