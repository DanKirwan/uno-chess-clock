import { Button, ButtonGroup, Divider, IconButton, Stack, TextField, Typography, useMediaQuery } from '@mui/material';
import { useState } from 'react';

import { useIntervalWhen, useKey } from "rooks";
import Timer from './components/Timer';

import HelpIcon from '@mui/icons-material/Help';
import useSound from 'use-sound';
import resetNoise from './audio/gdonk.m4a';
import lose from './audio/lose.m4a';
import next from './audio/next.m4a';
import flip from './audio/wabada.m4a';
import weoob from './audio/weoob.m4a';
import { ControlsDialog } from './components/ControlsDialog';
import { useBaseStore, useTemporalStore } from './lib/state';

const MS_PER_SECOND = 1000;

const interval = 100;


function App() {

  const large = useMediaQuery("(min-width:600px)");
  const [playNext] = useSound(next);
  const [playFlip] = useSound(flip);
  const [playLose] = useSound(lose);
  const [playReset] = useSound(resetNoise);
  const [playFinish] = useSound(weoob);

  const [playing, setPlaying] = useState(false);
  const [increment, setIncrement] = useState(2 * MS_PER_SECOND);
  const [startTime, setStartTime] = useState(30 * MS_PER_SECOND);
  const [playerCount, setPlayerCount] = useState(2);
  const [helpOpen, setHelpOpen] = useState(false);

  const { currentIndex, players, tick, finishTurn, flipTurn, reset: resetStore, setName } = useBaseStore((state) => state);
  const { undo, clear } = useTemporalStore((state) => state);


  const reset = () => {
    setPlaying(false);
    resetStore(players.length, startTime);
    clear();
  }


  const updatePlayers = () => {
    setPlaying(false);
    resetStore(playerCount, startTime);
    clear();
  }
  const start = () => {
    setPlaying(true);
  }


  const remainingPlayers = players.filter(p => p.time > 0).length;
  useIntervalWhen(
    () => {
      tick(interval);
      if (players[currentIndex].time - interval === 0) {
        if (remainingPlayers == 2) playFinish();
        else playLose();
      }

    },
    interval,
    playing && remainingPlayers > 1)

  const active = playing && remainingPlayers > 1;
  const doTurn = () => {
    if (!active) return;
    playNext();
    finishTurn(increment);
  }

  const doFlip = () => {
    if (!active) return;
    playFlip();
    flipTurn(increment);
  }

  const doUndo = () => {
    if (!active) return;
    playReset();
    undo(1);
  }

  useKey('Space', () => doTurn());
  useKey('Enter', () => doFlip());
  useKey('Escape', () => doUndo());

  return (
    <Stack
      spacing={4}
      width='100vw'
      alignItems='center'
    >
      <ControlsDialog open={helpOpen} handleClose={() => setHelpOpen(false)} />
      <Typography variant='h2'>Bullet Uno!</Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}

        justifyContent='space-between'
        spacing={1}
        sx={{
          width: { xs: '90%', md: '70%' },
          // alignItems: { xs: 'stretch', sm: 'center' }
        }}
      >
        <TextField
          fullWidth
          type='number'
          value={playerCount.toString()}
          onChange={e => setPlayerCount(+e.target.value)}
          onBlur={() => updatePlayers()}
          label='Player Count'
        />
        <TextField
          fullWidth
          type='number'
          value={(increment / MS_PER_SECOND).toString()}
          onChange={e => setIncrement(+e.target.value * MS_PER_SECOND)}
          label='Time Increment (s)'
        />
        <TextField
          fullWidth
          type='number'
          value={(startTime / MS_PER_SECOND).toString()}
          onChange={e => setStartTime(+e.target.value * MS_PER_SECOND)}
          label='Initial Time (s)'
        />
        <Button
          onClick={() => reset()}
          variant='contained'
          color='error'
          sx={{ width: { xs: '100%', sm: 'auto' } }}

        >
          Reset
        </Button>

        <Stack alignItems='center' justifyContent='center'>
          <IconButton onClick={() => setHelpOpen(true)}>
            <HelpIcon />
          </IconButton>
        </Stack>
      </Stack>


      <Stack spacing={2} sx={{ width: { xs: '90%', sm: '60%' } }}>
        {!playing ? (
          <Button
            fullWidth
            onClick={() => start()}
            variant='contained'
            size='large'
            color='warning'
            disabled={playing}
          >
            Start
          </Button>
        ) : (
          <ButtonGroup
            orientation={large ? 'horizontal' : 'vertical'}
            size='large'
            fullWidth

          >

            <Button
              onClick={() => doTurn()}
              variant='contained'
              sx={{ fontSize: { xs: 30, sm: 16 } }}
            >
              End Turn
            </Button>
            <Button
              onClick={() => doFlip()}
              variant='contained'
              color='secondary'
              sx={{ fontSize: { xs: 30, sm: 16 } }}
            >
              Flip Card
            </Button>
            <Button
              onClick={() => doUndo()}
              variant='contained'
              color='error'
              sx={{ fontSize: { xs: 30, sm: 16 } }}
            >
              Undo
            </Button>

          </ButtonGroup>
        )
        }

        <Divider />
        <Stack spacing={1}>

          {players.map((p, i) => (
            <Timer
              key={i}
              name={p.name}
              setName={(name) => setName(i, name)}
              milliseconds={p.time}
              active={i === currentIndex && playing}
              gameFinished={remainingPlayers === 1}
            />
          )
          )}
        </Stack>
      </Stack>
    </Stack >
  )
}

export default App
