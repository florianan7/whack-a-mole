import {describe, expect, it} from 'vitest'
import {getRandomHole} from './getRandomHole'

describe('getRandomHole', () => {
    it('devuelve una casilla entre 0 y total - 1', () => {
        for (let i = 0; i < 100; i++) {
            const hole = getRandomHole(9, null)
            expect(hole).toBeGreaterThanOrEqual(0)
            expect(hole).toBeLessThan(9)
        }
    })

    it('nunca repite la casilla excluida', () => {
        for (let i = 0; i < 100; i++) {
            expect(getRandomHole(9, 4)).not.toBe(4)
        }
    })

    it('salta la casilla excluida cuando el sorteo cae en ella', () => {
        expect(getRandomHole(9, 0, () => 0)).toBe(1)
    })

    it('no desplaza las casillas anteriores a la excluida', () => {
        expect(getRandomHole(9, 5, () => 0)).toBe(0)
    })

    it('puede devolver la última casilla', () => {
        // 0.999 * 8 → 7, which is >= 3 so it shifts to 8
        expect(getRandomHole(9, 3, () => 0.999)).toBe(8)
    })

    it('nunca devuelve la última casilla si es la excluida', () => {
        expect(getRandomHole(9, 8, () => 0.999)).toBe(7)
    })
})
