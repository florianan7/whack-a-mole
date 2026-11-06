export type Difficulty = 'low' | 'medium' | 'high'

interface DifficultyConfig {
    label: string
    intervalMs: number
    points: number
    moles: number
}

/** Reglas del juego para cada nivel de dificultad. */
export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
    low: {label: 'Bajo', intervalMs: 1000, points: 10, moles: 1},
    medium: {label: 'Medio', intervalMs: 750, points: 20, moles: 2},
    high: {label: 'Alto', intervalMs: 500, points: 30, moles: 3},
}

export const DIFFICULTY_LEVELS = Object.keys(DIFFICULTIES) as Difficulty[]

export const DEFAULT_DIFFICULTY: Difficulty = 'low'
