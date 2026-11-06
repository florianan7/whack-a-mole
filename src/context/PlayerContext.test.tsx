import {act, renderHook} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import {PlayerProvider, STORAGE_KEY, usePlayer} from './PlayerContext'

describe('PlayerContext', () => {
    it('empieza sin nombre si no hay nada guardado', () => {
        const {result} = renderHook(() => usePlayer(), {wrapper: PlayerProvider})
        expect(result.current.name).toBe('')
    })

    it('recupera el nombre guardado en localStorage', () => {
        localStorage.setItem(STORAGE_KEY, 'Ana')
        const {result} = renderHook(() => usePlayer(), {wrapper: PlayerProvider})
        expect(result.current.name).toBe('Ana')
    })

    it('guarda el nombre en localStorage al cambiarlo', () => {
        const {result} = renderHook(() => usePlayer(), {wrapper: PlayerProvider})

        act(() => result.current.setName('Luis'))

        expect(result.current.name).toBe('Luis')
        expect(localStorage.getItem(STORAGE_KEY)).toBe('Luis')
    })

    it('lanza un error si se usa fuera del PlayerProvider', () => {
        expect(() => renderHook(() => usePlayer())).toThrow(
            'usePlayer must be used inside PlayerProvider',
        )
    })
})
