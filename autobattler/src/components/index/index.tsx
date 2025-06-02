import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import HoverCell from './hoverCell';

import getFakeData from '@/components/fakeData';

export default function Index() {

    const fakeData = getFakeData(40);

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
                    {fakeData.map((monster) => (
                        <TableRow key={monster.id} sx={{
                            borderBottom: '1px solid var(--color-secondary)'
                        }}>
                            <TableCell>{monster.id}</TableCell>
                            <TableCell>{monster.name}</TableCell>
                            <HoverCell stats={monster.stats}>
                                <img src={monster.image} alt={monster.name} style={{ width: '50px', height: '50px' }} />
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