'use client';
import { useResult } from "@/context/result/resultContext";
import { useEffect, useState } from "react";
import MonsterCard from "@/components/card/monsterCard";
import { Box } from "@mui/material";

export default function ResultPopup({ ttl = 3.2 }) {
    const { result } = useResult();

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(true);
            setTimeout(() => {
                setVisible(false);
            }, ttl * 1000); // Hide after ttl seconds
        }, ttl * 1000);

        return () => clearTimeout(timer);
    }, [ttl, result]);

    if (!result || !visible) return null;

    if (result.image == "") {
        result.image = "/placeholder.png"; // Fallback image if no image is provided
    }

    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: '16px',
                borderRadius: '8px',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            onClick={() => setVisible(false)}
        >
            <h2 style={{ color: 'white', marginBottom: '8px' }}>Battle Result</h2>
            <MonsterCard monster={result} size="large" />
        </Box>
    );
}