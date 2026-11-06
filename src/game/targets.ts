import {BOMB_CHANCE} from './rules'

export type Target = 'mole' | 'bomb'

/** Pone un topo en cada casilla, o una bomba con probabilidad BOMB_CHANCE. */
export function assignTargets(
    holes: Iterable<number>,
    random: () => number = Math.random,
): Map<number, Target> {
    return new Map(
        Array.from(holes, (hole): [number, Target] => [
            hole,
            random() >= 1 - BOMB_CHANCE ? 'bomb' : 'mole',
        ]),
    )
}
