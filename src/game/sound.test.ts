import {afterEach, describe, expect, it, vi} from 'vitest'
import {playSound} from './sound'

const start = vi.fn()
const stop = vi.fn()
const resume = vi.fn(() => Promise.resolve())

/** AudioContext mínimo para comprobar que se arranca y se para un oscilador. */
class FakeAudioContext {
    currentTime = 0
    destination = {}
    state = 'suspended'
    resume = resume
    createOscillator() {
        return {
            type: 'sine',
            frequency: {setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn()},
            connect: () => ({connect: vi.fn()}),
            start,
            stop,
        }
    }
    createGain() {
        return {gain: {setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn()}}
    }
}

describe('playSound', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('sin Web Audio no hace nada', () => {
        expect(() => playSound('hit')).not.toThrow()
    })

    it('con Web Audio reproduce un sonido de duración limitada', () => {
        vi.stubGlobal('AudioContext', FakeAudioContext)

        playSound('bomb')

        expect(start).toHaveBeenCalledWith(0)
        expect(stop).toHaveBeenCalledWith(0.4)
    })

    it('reanuda el audio si el navegador lo había suspendido', () => {
        vi.stubGlobal('AudioContext', FakeAudioContext)

        playSound('hit')

        expect(resume).toHaveBeenCalled()
    })
})
