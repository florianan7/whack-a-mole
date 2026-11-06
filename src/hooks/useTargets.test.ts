import {act, renderHook} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {useTargets} from './useTargets'

describe('useTargets', () => {
    beforeEach(() => {
        vi.useFakeTimers()
        vi.spyOn(Math, 'random').mockReturnValue(0)
    })

    it('no muestra figuras si no se está jugando', () => {
        const {result} = renderHook(() => useTargets(false, 1000, 9, 1))

        act(() => vi.advanceTimersByTime(5000))

        expect(result.current.targets.size).toBe(0)
    })

    it('mueve el topo en cada intervalo sin repetir casilla', () => {
        const {result} = renderHook(() => useTargets(true, 1000, 9, 1))
        expect(result.current.targets.size).toBe(0)

        act(() => vi.advanceTimersByTime(1000))
        expect(result.current.targets).toEqual(new Map([[0, 'mole']]))

        act(() => vi.advanceTimersByTime(1000))
        expect(result.current.targets).toEqual(new Map([[1, 'mole']]))
    })

    it('muestra varias figuras a la vez', () => {
        const {result} = renderHook(() => useTargets(true, 1000, 9, 3))

        act(() => vi.advanceTimersByTime(1000))

        expect([...result.current.targets.keys()]).toEqual([0, 1, 2])
    })

    it('puede colocar bombas', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.9)
        const {result} = renderHook(() => useTargets(true, 1000, 9, 1))

        act(() => vi.advanceTimersByTime(1000))

        expect(result.current.targets).toEqual(new Map([[8, 'bomb']]))
    })

    it('respeta la velocidad de la dificultad', () => {
        const {result} = renderHook(() => useTargets(true, 500, 9, 1))

        act(() => vi.advanceTimersByTime(499))
        expect(result.current.targets.size).toBe(0)

        act(() => vi.advanceTimersByTime(1))
        expect(result.current.targets.size).toBe(1)
    })

    it('golpear una figura la quita, la devuelve y deja las demás', () => {
        const {result} = renderHook(() => useTargets(true, 1000, 9, 2))
        act(() => vi.advanceTimersByTime(1000))

        let hit = null
        act(() => {
            hit = result.current.whack(0)
        })

        expect(hit).toBe('mole')
        expect(result.current.targets).toEqual(new Map([[1, 'mole']]))
    })

    it('golpear una casilla vacía devuelve null', () => {
        const {result} = renderHook(() => useTargets(true, 1000, 9, 1))
        act(() => vi.advanceTimersByTime(1000))

        expect(result.current.whack(5)).toBeNull()
        expect(result.current.targets).toEqual(new Map([[0, 'mole']]))
    })

    it('esconde las figuras y para el intervalo al dejar de jugar', () => {
        const {result, rerender} = renderHook(({isPlaying}) => useTargets(isPlaying, 1000, 9, 1), {
            initialProps: {isPlaying: true},
        })
        act(() => vi.advanceTimersByTime(1000))

        rerender({isPlaying: false})
        act(() => vi.advanceTimersByTime(5000))

        expect(result.current.targets.size).toBe(0)
        expect(vi.getTimerCount()).toBe(0)
    })
})
