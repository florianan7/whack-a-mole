import {createContext, useContext, useState, type ReactNode} from 'react'

interface PlayerContextValue {
    name: string
    setName: (name: string) => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

export function PlayerProvider({children}: { children: ReactNode }) {
    const [name, setName] = useState('')
    return (
        <PlayerContext.Provider value={{name, setName}}>
            {children}
        </PlayerContext.Provider>
    )
}

export function usePlayer() {
    const context = useContext(PlayerContext)
    if (!context) {
        throw new Error('usePlayer must be used inside PlayerProvider')
    }
    return context
}
