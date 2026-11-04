import {createContext, useContext, useEffect, useState, type ReactNode} from 'react'

const STORAGE_KEY = 'whack-a-mole:player'

interface PlayerContextValue {
    name: string
    setName: (name: string) => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

function readStoredName(): string {
    try {
        return localStorage.getItem(STORAGE_KEY) ?? ''
    } catch (error) {
        console.warn('No se pudo leer el jugador de localStorage', error)
        return ''
    }
}

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

export function PlayerProvider({children}: { children: ReactNode }) {
    const [name, setName] = useState(readStoredName)

    useEffect(() => {
        storeName(name)
    }, [name])

    return (
        <PlayerContext.Provider value={{name, setName}}>
            {children}
        </PlayerContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePlayer() {
    const context = useContext(PlayerContext)
    if (!context) {
        throw new Error('usePlayer must be used inside PlayerProvider')
    }
    return context
}
