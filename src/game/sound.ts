export type Sound = 'hit' | 'bomb'

const SOUNDS: Record<Sound, {type: OscillatorType; from: number; to: number; duration: number}> = {
    hit: {type: 'square', from: 880, to: 1320, duration: 0.1},
    bomb: {type: 'sawtooth', from: 220, to: 40, duration: 0.4},
}

let context: AudioContext | undefined

/** Reproduce un pitido corto generado con Web Audio: agudo para el topo, grave para la bomba. */
export function playSound(sound: Sound): void {
    if (!('AudioContext' in window)) {
        return
    }
    context ??= new AudioContext()
    if (context.state === 'suspended') {
        void context.resume()
    }
    const {type, from, to, duration} = SOUNDS[sound]
    const now = context.currentTime
    const oscillator = context.createOscillator()
    const gain = context.createGain()

    oscillator.type = type
    oscillator.frequency.setValueAtTime(from, now)
    oscillator.frequency.exponentialRampToValueAtTime(to, now + duration)
    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration)

    oscillator.connect(gain).connect(context.destination)
    oscillator.start(now)
    oscillator.stop(now + duration)
}
