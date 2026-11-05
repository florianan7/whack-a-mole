import {createContext, useContext, useEffect, useState, type ReactNode} from 'react'

const STORAGE_KEY = 'whack-a-mole:player'

interface PlayerContextValue {
    name: string
    setName: (name: string) => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

/**
 * Reads the stored player name. Returns '' when nothing is stored or when
 * localStorage is unavailable (private mode, blocked storage), so the app
 * keeps working in memory instead of crashing.
 */
function readStoredName(): string {
    try {
        return localStorage.getItem(STORAGE_KEY) ?? ''
    } catch (error) {
        console.warn('No se pudo leer el jugador de localStorage', error)
        return ''
    }
}

/**
 * Persists the player name. An empty name removes the key, so "forgetting"
 * the player (change player) also clears the storage.
 */
function storeName(name: string): void {
    try {
        if (name) {
            localStorage.setItem(STORAGE_KEY, name)
        } else {
            localStorage.removeItem(STORAGE_KEY)
        }
    } catch (error) {
        console.warn('No se pudo guardar el jugador en localStorage', error)
    }
}

/**
 * Holds the current player and keeps it in sync with localStorage,
 * so the name survives reloads and offline reopenings (PWA).
 */
export function PlayerProvider({children}: {children: ReactNode}) {
    // Lazy initializer: localStorage is read once, on mount, not on every render.
    const [name, setName] = useState(readStoredName)

    useEffect(() => {
        storeName(name)
    }, [name])

    return <PlayerContext.Provider value={{name, setName}}>{children}</PlayerContext.Provider>
}

/**
 * Accessor for the player context. Throws when used outside PlayerProvider
 * to fail fast instead of silently returning null.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function usePlayer() {
    const context = useContext(PlayerContext)
    if (!context) {
        throw new Error('usePlayer must be used inside PlayerProvider')
    }
    return context
}
