import { Button } from '@mui/material';
import React from 'react';

interface TimerProps {
    milliseconds: number;
    active: boolean;
}

const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const tenths = Math.floor((milliseconds % 1000) / 100);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${tenths}`;
};

const Timer: React.FC<TimerProps> = ({ milliseconds, active }) => {
    return (

        <Button color={milliseconds < 0 ? 'error' : active ? 'success' : 'primary'} size='large' variant='contained'>

            {milliseconds < 0 ? (
                <span style={{ fontSize: 24 }}>PLAYER OUT</span>
            ) : (
                <span style={{ fontSize: 24 }}>{formatTime(milliseconds)}</span>
            )}
        </Button>

    );
};

export default Timer;
