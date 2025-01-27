import { Button, ButtonGroup, Grid2, imageListItemClasses, Stack, TextField } from '@mui/material';
import { findIndex, range } from 'lodash';
import { useState } from 'react';
import './App.css';

import { useIntervalWhen, useKey } from "rooks";
import Timer from './components/Timer';

import useSound from 'use-sound';
import next from './next.m4a';
import lose from './lose.m4a';


const MS_PER_SECOND = 1000;

const interval = 10;
function App() {

  const [playNext] = useSound(next);
  const [playLose] = useSound(lose);

  const [playing, setPlaying] = useState(false);
  const [increment, setIncrement] = useState(5 * MS_PER_SECOND);
  const [startTime, setStartTime] = useState(60 * MS_PER_SECOND);
  const [playerCount, setPlayerCount] = useState(5)

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);

  const [times, setTimes] = useState<number[]>([])
  const reset = () => {
    setCurrentPlayerIndex(0);
    setTimes(range(0, playerCount).map(_ => startTime));
    setPlaying(false);
  }


  const start = () => {
    setPlaying(true);
  }

  useIntervalWhen(() => {
    setTimes(c => c.map((x, i) => i === currentPlayerIndex ? x - interval : x))

    if (times[currentPlayerIndex] === 0) playLose();
  }, interval, playing)


  useKey('Space', (e) => {
    playNext();
    if (times[currentPlayerIndex] > 0) setTimes(c => c.map((x, i) => i === currentPlayerIndex ? x + increment : x))
    setCurrentPlayerIndex(x => {
      let index = x;
      const validIndices = times.map((t, i) => [t, i]).filter(([t, i]) => t > 0).map(([t, i]) => i);
      if (validIndices.length === 0) return x;
      index = (index + 1) % times.length

      while (!validIndices.includes(index)) {
        index = (index + 1) % times.length
      };
      return index;
    })
  });


  return (
    <Stack spacing={6}>
      <Stack direction='row' spacing={1}>
        <TextField type='number' value={playerCount.toString()} onChange={e => setPlayerCount(+e.target.value)} label='Player Count' />
        <TextField type='number' value={(increment / MS_PER_SECOND).toString()} onChange={e => setIncrement(+e.target.value * MS_PER_SECOND)} label='Time Increment' />
        <TextField type='number' value={(startTime / MS_PER_SECOND).toString()} onChange={e => setStartTime(+e.target.value * MS_PER_SECOND)} label='Initial Time' />
        <ButtonGroup>
          <Button onClick={() => reset()} variant='contained' color='error' >Reset</Button>
          <Button onClick={() => start()} variant='contained'>Start</Button>
        </ButtonGroup>
      </Stack>

      <Stack spacing={2}>


        {times.map((x, i) => <Timer milliseconds={x} active={i === currentPlayerIndex && playing} />)}
      </Stack>


    </Stack>
  )
}

export default App
