import { Button, Card, CardContent, Stack, TextField } from '@mui/material';
import React from 'react';

interface TimerProps {
    milliseconds: number;
    active: boolean;
    name: string;
    setName: (name: string) => void;
    gameFinished: boolean;
}

const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const tenths = Math.floor((milliseconds % 1000) / 100);

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${tenths}`;
};

const Timer: React.FC<TimerProps> = ({ milliseconds, active, name, setName, gameFinished }) => {
    return (
        <Card>
            <CardContent>

                <Stack direction='row' spacing={2}  >
                    <TextField value={name} onChange={e => setName(e.target.value)} label='Name' sx={{ width: 200 }} />
                    <Button
                        color={milliseconds <= 0
                            ? 'error'
                            : (active || gameFinished)
                                ? 'success'
                                : 'primary'}
                        size='large'
                        variant='contained'
                        fullWidth

                    >

                        {
                            milliseconds <= 0
                                ? <span style={{ fontSize: 20 }}>YOU LOSE!</span>
                                : gameFinished
                                    ? <span style={{ fontSize: 20 }}>YOU WIN!</span>
                                    : <span style={{ fontSize: 20 }}>{formatTime(milliseconds)}</span>
                        }
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default Timer;
