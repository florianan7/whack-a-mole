import {useEffect, useState} from 'react'
import {Navigate} from 'react-router-dom'
import {usePlayer} from '../context/PlayerContext'
import DifficultySelector from '../components/DifficultySelector'
import Board from '../components/Board'
import HapticSwitch from '../components/HapticSwitch'
import {useTargets} from '../hooks/useTargets'
import {DEFAULT_DIFFICULTY, DIFFICULTIES, type Difficulty} from '../game/difficulty'
import {GAME_DURATION_S, INITIAL_LIVES, TOTAL_HOLES} from '../game/rules'
import {playSound} from '../game/sound'
import {vibrate} from '../game/vibrate'

const HIT_VIBRATION_MS = 50
const BOMB_VIBRATION_MS = 300

/** Vista de juego: jugador, vidas, tiempo, puntos, dificultad y tablero. */
function GamePage() {
    const {name, setName} = usePlayer()
    const [score, setScore] = useState(0)
    const [lives, setLives] = useState(INITIAL_LIVES)
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION_S)
    const [difficulty, setDifficulty] = useState<Difficulty>(DEFAULT_DIFFICULTY)
    const [isPlaying, setIsPlaying] = useState(false)

    const isOver = !lives || !timeLeft
    const isRunning = isPlaying && !isOver
    const {intervalMs, points, moles} = DIFFICULTIES[difficulty]
    const {targets, whack} = useTargets(isRunning, intervalMs, TOTAL_HOLES, moles)

    /** Descuenta un segundo mientras dura la partida. */
    useEffect(() => {
        if (!isRunning) {
            return
        }
        const intervalId = setInterval(() => setTimeLeft((seconds) => seconds - 1), 1000)
        return () => clearInterval(intervalId)
    }, [isRunning])

    if (!name) {
        return <Navigate to="/" replace />
    }

    /** Suma puntos por un topo o resta una vida por una bomba, y devuelve el texto a mostrar. */
    function handleWhack(index: number): string | null {
        const target = whack(index)
        if (target === 'mole') {
            setScore((previous) => previous + points)
            playSound('hit')
            vibrate(HIT_VIBRATION_MS)
            return `+${points}`
        }
        if (target === 'bomb') {
            setLives((previous) => previous - 1)
            playSound('bomb')
            vibrate(BOMB_VIBRATION_MS)
            return '-1 ❤️'
        }
        return null
    }

    /** Empieza una partida nueva, o para la actual. */
    function handlePlayClick() {
        if (isRunning) {
            setIsPlaying(false)
            return
        }
        setScore(0)
        setLives(INITIAL_LIVES)
        setTimeLeft(GAME_DURATION_S)
        setIsPlaying(true)
    }

    /** Olvida al jugador y vuelve a home. */
    function handleChangePlayer() {
        setName('')
    }

    return (
        <main className="page">
            <header className="game-header">
                <h1 className="game-header__name">{name}</h1>
                <ul className="stats">
                    <li className="stat" aria-label={`Vidas: ${lives}`}>
                        {'❤️'.repeat(lives) + '🖤'.repeat(INITIAL_LIVES - lives)}
                    </li>
                    <li className="stat">⏱ {timeLeft} s</li>
                    <li className="stat" aria-live="polite">
                        Puntos: {score}
                    </li>
                </ul>
            </header>

            <DifficultySelector value={difficulty} onChange={setDifficulty} disabled={isRunning} />

            <button className="button" type="button" onClick={handlePlayClick}>
                {isRunning ? 'Parar' : 'Play'}
            </button>

            {isRunning && (
                <Board totalHoles={TOTAL_HOLES} targets={targets} onWhack={handleWhack} />
            )}

            {isPlaying && isOver && (
                <p className="game-over" role="status">
                    {lives ? 'Se acabó el tiempo' : 'Te has quedado sin vidas'}. Has conseguido{' '}
                    {score} puntos.
                </p>
            )}

            <button
                className="button button--secondary"
                type="button"
                onClick={handleChangePlayer}
                disabled={isRunning}
            >
                Cambiar jugador
            </button>

            <HapticSwitch />
        </main>
    )
}

export default GamePage
