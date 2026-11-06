import {act, renderHook} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {useMoles} from './useMoles'

describe('useMoles', () => {
    beforeEach(() => {
        vi.useFakeTimers()
        vi.spyOn(Math, 'random').mockReturnValue(0)
    })

    it('no muestra topos si no se está jugando', () => {
        const {result} = renderHook(() => useMoles(false, 1000, 9, 1))

        act(() => vi.advanceTimersByTime(5000))

        expect(result.current.molePositions.size).toBe(0)
    })

    it('mueve el topo en cada intervalo sin repetir casilla', () => {
        const {result} = renderHook(() => useMoles(true, 1000, 9, 1))
        expect(result.current.molePositions.size).toBe(0)

        act(() => vi.advanceTimersByTime(1000))
        expect(result.current.molePositions).toEqual(new Set([0]))

        act(() => vi.advanceTimersByTime(1000))
        expect(result.current.molePositions).toEqual(new Set([1]))
    })

    it('muestra varios topos a la vez', () => {
        const {result} = renderHook(() => useMoles(true, 1000, 9, 3))

        act(() => vi.advanceTimersByTime(1000))

        expect(result.current.molePositions).toEqual(new Set([0, 1, 2]))
    })

    it('respeta la velocidad de la dificultad', () => {
        const {result} = renderHook(() => useMoles(true, 500, 9, 1))

        act(() => vi.advanceTimersByTime(499))
        expect(result.current.molePositions.size).toBe(0)

        act(() => vi.advanceTimersByTime(1))
        expect(result.current.molePositions.size).toBe(1)
    })

    it('golpear un topo lo esconde, devuelve true y deja los demás', () => {
        const {result} = renderHook(() => useMoles(true, 1000, 9, 2))
        act(() => vi.advanceTimersByTime(1000))

        let hit = false
        act(() => {
            hit = result.current.whack(0)
        })

        expect(hit).toBe(true)
        expect(result.current.molePositions).toEqual(new Set([1]))
    })

    it('golpear una casilla vacía devuelve false', () => {
        const {result} = renderHook(() => useMoles(true, 1000, 9, 1))
        act(() => vi.advanceTimersByTime(1000))

        expect(result.current.whack(5)).toBe(false)
        expect(result.current.molePositions).toEqual(new Set([0]))
    })

    it('esconde los topos y para el intervalo al dejar de jugar', () => {
        const {result, rerender} = renderHook(({isPlaying}) => useMoles(isPlaying, 1000, 9, 1), {
            initialProps: {isPlaying: true},
        })
        act(() => vi.advanceTimersByTime(1000))

        rerender({isPlaying: false})
        act(() => vi.advanceTimersByTime(5000))

        expect(result.current.molePositions.size).toBe(0)
        expect(vi.getTimerCount()).toBe(0)
    })
})
