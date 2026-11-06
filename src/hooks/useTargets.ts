import {useEffect, useState} from 'react'
import {getRandomHoles} from '../game/getRandomHoles'
import {assignTargets, type Target} from '../game/targets'

const NO_TARGETS: ReadonlyMap<number, Target> = new Map()

/** Coloca `count` topos o bombas en casillas aleatorias cada `intervalMs` mientras dura la partida. */
export function useTargets(
    isPlaying: boolean,
    intervalMs: number,
    totalHoles: number,
    count: number,
) {
    const [targets, setTargets] = useState<ReadonlyMap<number, Target>>(NO_TARGETS)

    useEffect(() => {
        if (!isPlaying) {
            return
        }

        const intervalId = setInterval(() => {
            setTargets((previous) =>
                assignTargets(getRandomHoles(totalHoles, count, new Set(previous.keys()))),
            )
        }, intervalMs)

        return () => {
            clearInterval(intervalId)
            setTargets(NO_TARGETS)
        }
    }, [isPlaying, intervalMs, totalHoles, count])

    /** Quita la figura de la casilla `index` y devuelve cuál era, o null si estaba vacía. */
    function whack(index: number): Target | null {
        const target = isPlaying ? targets.get(index) : undefined
        if (!target) {
            return null
        }
        setTargets((previous) => {
            const next = new Map(previous)
            next.delete(index)
            return next
        })
        return target
    }

    return {targets: isPlaying ? targets : NO_TARGETS, whack}
}
