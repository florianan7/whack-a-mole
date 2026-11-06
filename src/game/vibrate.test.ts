import {afterEach, describe, expect, it, vi} from 'vitest'
import {HAPTIC_SWITCH_ID, vibrate} from './vibrate'

describe('vibrate', () => {
    afterEach(() => {
        delete (navigator as {vibrate?: unknown}).vibrate
        document.body.innerHTML = ''
    })

    it('usa navigator.vibrate cuando existe', () => {
        const nativeVibrate = vi.fn()
        Object.defineProperty(navigator, 'vibrate', {value: nativeVibrate, configurable: true})

        vibrate(50)

        expect(nativeVibrate).toHaveBeenCalledWith(50)
    })

    it('sin navigator.vibrate pulsa el interruptor háptico', () => {
        document.body.innerHTML = `
            <input type="checkbox" id="${HAPTIC_SWITCH_ID}" />
            <label for="${HAPTIC_SWITCH_ID}"></label>
        `
        const input = document.getElementById(HAPTIC_SWITCH_ID) as HTMLInputElement

        vibrate(50)

        expect(input.checked).toBe(true)
    })

    it('sin navigator.vibrate ni interruptor no hace nada', () => {
        expect(() => vibrate(50)).not.toThrow()
    })
})
