import { chain, range } from 'lodash';
import { temporal, TemporalState } from 'zundo';
import { createStore } from 'zustand';
import { useStoreWithEqualityFn } from 'zustand/traditional';

type Player = {
    time: number;
    name: string,
}
// Define the type of your store state (typescript)
type StoreState = {
    players: Player[];
    currentIndex: number;
    direction: number;
    tick: (interval: number) => void;
    finishTurn: (increment: number) => void;
    flipTurn: (increment: number) => void;
    reset: (count: number, startTime: number) => void;
    setName: (index: number, name: string) => void;
}

const updatePlayer = (players: Player[], playerIndex: number, transform: (player: Player) => Player) => {
    return players.map((player, i) => i === playerIndex ? transform(player) : player);
}


const getNextIndex = (players: Player[], currentIndex: number, direction: number) => {
    let index = currentIndex;
    const validIndices = players
        .map<[Player, number]>((p, i) => [p, i])
        .filter(([p, _]) => p.time > 0)
        .map(([_, i]) => i);

    if (validIndices.length === 0) return index;
    index = (index + direction + players.length) % players.length

    while (!validIndices.includes(index)) {
        index = (index + direction + players.length) % players.length
    };
    return index;
}


// Use `temporal` middleware to create a store with undo/redo capabilities
export const appStore = createStore<StoreState>()(
    temporal((set) => ({
        players: [{ name: '', time: 0 }, { name: '', time: 0 }],
        currentIndex: 0,
        direction: 1,
        finishTurn: (increment: number) => set(({ players, currentIndex, direction }) => ({
            players: updatePlayer(players, currentIndex, p => ({ ...p, time: p.time < 0 ? 0 : p.time + increment })),
            currentIndex: getNextIndex(players, currentIndex, direction)
        })),
        flipTurn: (increment: number) => set(({ players, currentIndex, direction }) => ({
            players: updatePlayer(players, currentIndex, p => ({ ...p, time: p.time < 0 ? 0 : p.time + increment })),
            currentIndex: getNextIndex(players, currentIndex, -direction),
            direction: -direction
        })),
        reset: (count: number, startTime: number) => set(({ players }) => {
            const toAdd = Math.max(0, count - players.length);
            const newPlayers = chain(players)
                .take(count)
                .concat(range(0, toAdd).map(_ => ({ name: "", time: 0 })))
                .map(({ name }) => ({ name, time: startTime }))
                .value();
            return {
                players: newPlayers,
                currentIndex: 0,
                direction: 1
            }
        }),
        setName: (index: number, name: string) => set(({ players }) => ({ players: updatePlayer(players, index, p => ({ ...p, name })) })),
        tick: (interval: number) => set(({ players, currentIndex }) => ({ players: updatePlayer(players, currentIndex, p => ({ ...p, time: p.time - interval })) }))
    }),
        {
            diff: (pastState, currentState) => {
                if (currentState.currentIndex == pastState.currentIndex) return null;
                return pastState;
            }
        })
);



export const useBaseStore = <T,>(
    selector: (state: StoreState) => T,
    equality?: (a: T, b: T) => boolean,
) => useStoreWithEqualityFn(appStore, selector, equality);

export const useTemporalStore = <T>(
    selector?: (state: TemporalState<StoreState>) => T,
    equality?: (a: T, b: T) => boolean,
): T => {
    return useStoreWithEqualityFn(appStore.temporal, selector!, equality);
}