import { Button, ButtonGroup, Grid2, imageListItemClasses, Stack, TextField } from '@mui/material';
import { findIndex, range } from 'lodash';
import { useState } from 'react';

import { useIntervalWhen, useKey } from "rooks";
import Timer from './components/Timer';

import useSound from 'use-sound';
import next from './next.m4a';
import lose from './lose.m4a';
import flip from './wabada.m4a';
import resetNoise from './gdonk.m4a';


const MS_PER_SECOND = 1000;

const interval = 10;

function App() {

  const [playNext] = useSound(next);
  const [playFlip] = useSound(flip);
  const [playLose] = useSound(lose);
  const [playReset] = useSound(resetNoise);

  const [playing, setPlaying] = useState(false);
  const [increment, setIncrement] = useState(2 * MS_PER_SECOND);
  const [startTime, setStartTime] = useState(30 * MS_PER_SECOND);
  const [playerCount, setPlayerCount] = useState(4)

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [names, setNames] = useState<string[]>([])
  const [times, setTimes] = useState<number[]>([])

  const [prevPlayerIndex, setPrevPlayerIndex] = useState(0);
  const [prevTimes, setPrevTimes] = useState<number[]>([]);
  const [prevMultiplier, setPrevMultiplier] = useState(1);

  const reset = () => {
    setCurrentPlayerIndex(0);
    setTimes(range(0, playerCount).map(_ => startTime));
    setNames(range(0, playerCount).map(_ => ""));
    setPlaying(false);
  }


  const start = () => {
    setPlaying(true);
  }

  useIntervalWhen(() => {
    setTimes(c => c.map((x, i) => i === currentPlayerIndex ? x - interval : x))

    if (times[currentPlayerIndex] === 0) playLose();
  }, interval, playing)


  const [multiplier, setMultiplier] = useState(1);

  const doNext = (prevMultiplier: number, multiplier: number) => {
    if (times[currentPlayerIndex] > 0) setTimes(c => c.map((x, i) => i === currentPlayerIndex ? x + increment : x))
    setPrevPlayerIndex(currentPlayerIndex);
    setPrevTimes(times);
    setPrevMultiplier(prevMultiplier);
    setCurrentPlayerIndex(x => {
      let index = x;
      const validIndices = times.map((t, i) => [t, i]).filter(([t, i]) => t > 0).map(([t, i]) => i);
      if (validIndices.length === 0) return x;
      index = (index + multiplier + times.length) % times.length

      while (!validIndices.includes(index)) {
        index = (index + multiplier + times.length) % times.length
      };
      return index;
    })
  }
  useKey('Space', (e) => {
    if (!playing) return;
    playNext();
    doNext(multiplier, multiplier);
  });

  useKey('Enter', (e) => {
    if (!playing) return;
    playFlip();
    doNext(multiplier, -multiplier);
    setMultiplier(m => -m);
  });



  useKey('Escape', (e) => {

    if (!playing) return;
    playReset();
    setTimes(prevTimes);
    setCurrentPlayerIndex(prevPlayerIndex);
    setMultiplier(prevMultiplier)
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

      <Stack spacing={2} width={'100%'}>


        {times.map((x, i) => <Timer
          name={names[i]}
          setName={(name) => setNames(ns => ns.map((n, nameIndex) => i === nameIndex ? name : n))}
          milliseconds={x}
          active={i === currentPlayerIndex && playing} />)}
      </Stack>


    </Stack>
  )
}

export default App
