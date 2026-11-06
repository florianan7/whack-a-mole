import {createContext, useContext, useEffect, useState, type ReactNode} from 'react'

export const STORAGE_KEY = 'whack-a-mole:player'

interface PlayerContextValue {
    name: string
    setName: (name: string) => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

/** Lee el nombre del jugador guardado, o '' si no hay ninguno. */
function readStoredName(): string {
    try {
        return localStorage.getItem(STORAGE_KEY) ?? ''
    } catch (error) {
        console.warn('No se pudo leer el jugador de localStorage', error)
        return ''
    }
}

/** Guarda el nombre del jugador, o lo borra si está vacío. */
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

/** Comparte el jugador actual con toda la app y lo mantiene guardado entre sesiones. */
export function PlayerProvider({children}: {children: ReactNode}) {
    const [name, setName] = useState(readStoredName)

    useEffect(() => {
        storeName(name)
    }, [name])

    return <PlayerContext.Provider value={{name, setName}}>{children}</PlayerContext.Provider>
}

/** Da acceso al jugador actual. Debe usarse dentro de PlayerProvider. */
// eslint-disable-next-line react-refresh/only-export-components
export function usePlayer() {
    const context = useContext(PlayerContext)
    if (!context) {
        throw new Error('usePlayer must be used inside PlayerProvider')
    }
    return context
}
