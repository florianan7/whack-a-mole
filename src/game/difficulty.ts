export type Difficulty = 'low' | 'medium' | 'high'

interface DifficultyConfig {
    label: string
    /** How often the mole changes hole. */
    intervalMs: number
    /** Points awarded per hit. */
    points: number
}

/**
 * Game rules per difficulty level (single source of truth).
 * `Record<Difficulty, ...>` makes TypeScript complain if a level is missing.
 */
export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
    low: {label: 'Bajo', intervalMs: 1000, points: 10},
    medium: {label: 'Medio', intervalMs: 750, points: 20},
    high: {label: 'Alto', intervalMs: 500, points: 30},
}

// Derived from the table above so the list can never get out of sync with it.
// Object.keys() is typed as string[], hence the cast (safe thanks to the Record).
export const DIFFICULTY_LEVELS = Object.keys(DIFFICULTIES) as Difficulty[]

export const DEFAULT_DIFFICULTY: Difficulty = 'low'
