import {describe, expect, it} from 'vitest'
import {assignTargets} from './targets'

describe('assignTargets', () => {
    it('usa exactamente las casillas que recibe', () => {
        expect([...assignTargets([2, 5, 7]).keys()]).toEqual([2, 5, 7])
    })

    it('pone topos con los sorteos bajos', () => {
        expect(assignTargets([0, 1], () => 0)).toEqual(
            new Map([
                [0, 'mole'],
                [1, 'mole'],
            ]),
        )
    })

    it('pone bombas con los sorteos altos', () => {
        expect(assignTargets([0, 1], () => 0.9)).toEqual(
            new Map([
                [0, 'bomb'],
                [1, 'bomb'],
            ]),
        )
    })

    it('solo reparte topos y bombas', () => {
        for (const target of assignTargets([0, 1, 2, 3, 4, 5, 6, 7, 8]).values()) {
            expect(['mole', 'bomb']).toContain(target)
        }
    })
})
