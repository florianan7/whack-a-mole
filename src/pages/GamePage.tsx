import {useState} from 'react'
import {Navigate} from 'react-router-dom'
import {usePlayer} from '../context/PlayerContext'
import DifficultySelector from '../components/DifficultySelector'
import Board from '../components/Board'
import {useMole} from '../hooks/useMole'
import {DEFAULT_DIFFICULTY, DIFFICULTIES, type Difficulty} from '../game/difficulty'

const TOTAL_HOLES = 9
const HIT_VIBRATION_MS = 50

/**
 * Game view: player name, score, difficulty selector, Play/Stop button and the board.
 * Owns the game state (score, difficulty, playing) and delegates the mole
 * logic to the useMole hook.
 */
function GamePage() {
    const {name, setName} = usePlayer()
    const [score, setScore] = useState(0)
    const [difficulty, setDifficulty] = useState<Difficulty>(DEFAULT_DIFFICULTY)
    const [isPlaying, setIsPlaying] = useState(false)

    const {intervalMs, points} = DIFFICULTIES[difficulty]
    // Hooks must run before any early return (rules of hooks).
    const {molePosition, whack} = useMole(isPlaying, intervalMs, TOTAL_HOLES)

    // Route guard: no player registered → back to home.
    if (!name) {
        return <Navigate to="/" replace/>
    }

    /** Adds the difficulty points (and vibrates, where supported) when a mole is hit. */
    function handleWhack(index: number) {
        if (whack(index)) {
            setScore((previous) => previous + points)
            navigator.vibrate?.(HIT_VIBRATION_MS)
        }
    }

    /** Toggles the game. Each new game starts from 0 points. */
    function handlePlayClick() {
        if (!isPlaying) {
            setScore(0)
        }
        setIsPlaying((previous) => !previous)
    }

    /** Forgets the player; the route guard above then redirects to home. */
    function handleChangePlayer() {
        setName('')
    }

    return (
        <main className="page">
            <header className="game-header">
                <h1 className="game-header__name">{name}</h1>
                <p className="score" aria-live="polite">Puntos: {score}</p>
            </header>

            <DifficultySelector
                value={difficulty}
                onChange={setDifficulty}
                disabled={isPlaying}
            />

            <button className="button" type="button" onClick={handlePlayClick}>
                {isPlaying ? 'Parar' : 'Play'}
            </button>

            {isPlaying && (
                <Board
                    totalHoles={TOTAL_HOLES}
                    molePosition={molePosition}
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
