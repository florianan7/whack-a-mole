import {act, renderHook} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {useMole} from './useMole'

describe('useMole', () => {
    beforeEach(() => {
        vi.useFakeTimers()
        vi.spyOn(Math, 'random').mockReturnValue(0)
    })

    it('no muestra topo si no se está jugando', () => {
        const {result} = renderHook(() => useMole(false, 1000, 9))

        act(() => vi.advanceTimersByTime(5000))

        expect(result.current.molePosition).toBeNull()
    })

    it('mueve el topo en cada intervalo', () => {
        const {result} = renderHook(() => useMole(true, 1000, 9))
        expect(result.current.molePosition).toBeNull()

        act(() => vi.advanceTimersByTime(1000))
        expect(result.current.molePosition).toBe(0)

        act(() => vi.advanceTimersByTime(1000))
        expect(result.current.molePosition).toBe(1) // never the same hole twice
    })

    it('respeta la velocidad de la dificultad', () => {
        const {result} = renderHook(() => useMole(true, 500, 9))

        act(() => vi.advanceTimersByTime(499))
        expect(result.current.molePosition).toBeNull()

        act(() => vi.advanceTimersByTime(1))
        expect(result.current.molePosition).toBe(0)
    })

    it('golpear el topo lo esconde y devuelve true', () => {
        const {result} = renderHook(() => useMole(true, 1000, 9))
        act(() => vi.advanceTimersByTime(1000))

        let hit = false
        act(() => {
            hit = result.current.whack(0)
        })

        expect(hit).toBe(true)
        expect(result.current.molePosition).toBeNull()
    })

    it('golpear una casilla vacía devuelve false', () => {
        const {result} = renderHook(() => useMole(true, 1000, 9))
        act(() => vi.advanceTimersByTime(1000))

        expect(result.current.whack(5)).toBe(false)
        expect(result.current.molePosition).toBe(0)
    })

    it('esconde el topo y para el intervalo al dejar de jugar', () => {
        const {result, rerender} = renderHook(({isPlaying}) => useMole(isPlaying, 1000, 9), {
            initialProps: {isPlaying: true},
        })
        act(() => vi.advanceTimersByTime(1000))

        rerender({isPlaying: false})
        act(() => vi.advanceTimersByTime(5000))

        expect(result.current.molePosition).toBeNull()
        expect(vi.getTimerCount()).toBe(0)
    })
})
