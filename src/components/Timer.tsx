import { Button, Paper, Stack, TextField } from '@mui/material';
import React from 'react';

interface TimerProps {
    milliseconds: number;
    active: boolean;
    name: string;
    setName: (name: string) => void;
}

const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const tenths = Math.floor((milliseconds % 1000) / 100);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${tenths}`;
};

const Timer: React.FC<TimerProps> = ({ milliseconds, active, name, setName }) => {
    return (
        <Stack direction='row' spacing={2}  >
            <TextField value={name} onChange={e => setName(e.target.value)} label='Name' sx={{ width: 200 }} />
            <Button
                color={milliseconds <= 0 ? 'error' : active ? 'success' : 'primary'}
                size='large'
                variant='contained'
                fullWidth

            >

                {milliseconds <= 0 ? (
                    <span style={{ fontSize: 24 }}>PLAYER OUT</span>
                ) : (
                    <span style={{ fontSize: 24 }}>{formatTime(milliseconds)}</span>
                )}
            </Button>
        </Stack>
    );
};

export default Timer;
