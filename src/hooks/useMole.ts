import {useEffect, useState} from 'react'
import {getRandomHole} from '../game/getRandomHole'

/**
 * Drives the mole: while playing, it jumps to a random hole every `intervalMs`.
 *
 * @returns `molePosition` – index of the hole with the mole, or null when hidden.
 * @returns `whack(index)` – true when `index` had the mole (and hides it), false otherwise.
 */
export function useMole(isPlaying: boolean, intervalMs: number, totalHoles: number) {
    const [position, setPosition] = useState<number | null>(null)

    useEffect(() => {
        if (!isPlaying) {
            return
        }

        const intervalId = setInterval(() => {
            // Functional update: the interval callback is created once, so reading
            // `position` directly would always see the initial (stale) value.
            setPosition((previous) => getRandomHole(totalHoles, previous))
        }, intervalMs)

        // Cleanup runs on stop, on difficulty change and on unmount:
        // stops the timer so it never keeps running in the background.
        return () => {
            clearInterval(intervalId)
            setPosition(null)
        }
    }, [isPlaying, intervalMs, totalHoles])

    /** Hides the mole on a hit so the same mole cannot score twice. */
    function whack(index: number): boolean {
        if (!isPlaying || index !== position) {
            return false
        }
        setPosition(null)
        return true
    }

    return {molePosition: isPlaying ? position : null, whack}
}
