import {useEffect, useState} from 'react'
import {getRandomHoles} from '../game/getRandomHoles'

const NO_MOLES: ReadonlySet<number> = new Set()

/** Mueve `count` topos a casillas aleatorias cada `intervalMs` mientras dura la partida. */
export function useMoles(
    isPlaying: boolean,
    intervalMs: number,
    totalHoles: number,
    count: number,
) {
    const [positions, setPositions] = useState<ReadonlySet<number>>(NO_MOLES)

    useEffect(() => {
        if (!isPlaying) {
            return
        }

        const intervalId = setInterval(() => {
            setPositions((previous) => getRandomHoles(totalHoles, count, previous))
        }, intervalMs)

        return () => {
            clearInterval(intervalId)
            setPositions(NO_MOLES)
        }
    }, [isPlaying, intervalMs, totalHoles, count])

    /** Esconde el topo de la casilla `index` y devuelve si lo había. */
    function whack(index: number): boolean {
        if (!isPlaying || !positions.has(index)) {
            return false
        }
        setPositions((previous) => {
            const next = new Set(previous)
            next.delete(index)
            return next
        })
        return true
    }

    return {molePositions: isPlaying ? positions : NO_MOLES, whack}
}
