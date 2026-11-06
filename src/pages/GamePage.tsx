import {useState} from 'react'
import {Navigate} from 'react-router-dom'
import {usePlayer} from '../context/PlayerContext'
import DifficultySelector from '../components/DifficultySelector'
import Board from '../components/Board'
import {useMoles} from '../hooks/useMoles'
import {DEFAULT_DIFFICULTY, DIFFICULTIES, type Difficulty} from '../game/difficulty'

const TOTAL_HOLES = 9
const HIT_VIBRATION_MS = 50

/** Vista de juego: jugador, puntos, dificultad, botón Play/Parar y tablero. */
function GamePage() {
    const {name, setName} = usePlayer()
    const [score, setScore] = useState(0)
    const [difficulty, setDifficulty] = useState<Difficulty>(DEFAULT_DIFFICULTY)
    const [isPlaying, setIsPlaying] = useState(false)

    const {intervalMs, points, moles} = DIFFICULTIES[difficulty]
    const {molePositions, whack} = useMoles(isPlaying, intervalMs, TOTAL_HOLES, moles)

    if (!name) {
        return <Navigate to="/" replace />
    }

    /** Suma los puntos si en la casilla había un topo. */
    function handleWhack(index: number) {
        if (whack(index)) {
            setScore((previous) => previous + points)
            navigator.vibrate?.(HIT_VIBRATION_MS)
        }
    }

    /** Empieza una partida nueva desde 0 puntos, o para la actual. */
    function handlePlayClick() {
        if (!isPlaying) {
            setScore(0)
        }
        setIsPlaying((previous) => !previous)
    }

    /** Olvida al jugador y vuelve a home. */
    function handleChangePlayer() {
        setName('')
    }

    return (
        <main className="page">
            <header className="game-header">
                <h1 className="game-header__name">{name}</h1>
                <p className="score" aria-live="polite">
                    Puntos: {score}
                </p>
            </header>

            <DifficultySelector value={difficulty} onChange={setDifficulty} disabled={isPlaying} />

            <button className="button" type="button" onClick={handlePlayClick}>
                {isPlaying ? 'Parar' : 'Play'}
            </button>

            {isPlaying && (
                <Board
                    totalHoles={TOTAL_HOLES}
                    molePositions={molePositions}
                    onWhack={handleWhack}
                />
            )}

            <button
                className="button button--secondary"
                type="button"
                onClick={handleChangePlayer}
                disabled={isPlaying}
            >
                Cambiar jugador
            </button>
        </main>
    )
}

export default GamePage
