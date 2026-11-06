import {describe, expect, it} from 'vitest'
import {getRandomHoles} from './getRandomHoles'

const none = new Set<number>()

describe('getRandomHoles', () => {
    it('devuelve tantas casillas distintas como se piden, dentro del rango', () => {
        for (let i = 0; i < 100; i++) {
            const holes = getRandomHoles(9, 3, none)
            expect(holes.size).toBe(3)
            for (const hole of holes) {
                expect(hole).toBeGreaterThanOrEqual(0)
                expect(hole).toBeLessThan(9)
            }
        }
    })

    it('nunca repite las casillas excluidas', () => {
        const previous = new Set([0, 4, 8])
        for (let i = 0; i < 100; i++) {
            for (const hole of getRandomHoles(9, 3, previous)) {
                expect(previous.has(hole)).toBe(false)
            }
        }
    })

    it('con el sorteo mínimo elige las primeras casillas libres', () => {
        expect(getRandomHoles(9, 2, new Set([0, 1]), () => 0)).toEqual(new Set([2, 3]))
    })

    it('con el sorteo máximo elige las últimas casillas libres', () => {
        expect(getRandomHoles(9, 1, new Set([8]), () => 0.999)).toEqual(new Set([7]))
    })

    it('si no quedan casillas libres suficientes devuelve solo las libres', () => {
        const almostAll = new Set([0, 1, 2, 3, 4, 5, 6, 7])
        expect(getRandomHoles(9, 2, almostAll, () => 0)).toEqual(new Set([8]))
    })

    it('nunca pide más casillas de las que existen', () => {
        expect(getRandomHoles(2, 5, none).size).toBe(2)
    })
})
