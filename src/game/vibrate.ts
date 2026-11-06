export const HAPTIC_SWITCH_ID = 'haptic-switch'

/** Vibra con la API estándar o, en iOS, con el tic del interruptor nativo (experimental). */
export function vibrate(ms: number): void {
    if (navigator.vibrate) {
        navigator.vibrate(ms)
        return
    }
    document.querySelector<HTMLLabelElement>(`label[for="${HAPTIC_SWITCH_ID}"]`)?.click()
}
