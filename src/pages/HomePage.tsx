import {useState, type SubmitEvent} from 'react'
import {useNavigate} from 'react-router-dom'
import {usePlayer} from '../context/PlayerContext'

const MIN_LENGTH = 2
const MAX_LENGTH = 15
const VALID_NAME = /^[\p{L}\p{N} ]+$/u

/** Devuelve el mensaje de error de un nombre no válido, o '' si es válido. */
function validateName(name: string): string {
    if (name.length < MIN_LENGTH || name.length > MAX_LENGTH) {
        return `El nombre debe tener entre ${MIN_LENGTH} y ${MAX_LENGTH} caracteres`
    }
    if (!VALID_NAME.test(name)) {
        return 'El nombre solo puede contener letras, números y espacios'
    }
    return ''
}

/** Vista home: pide el nombre del jugador e inicia el juego. */
function HomePage() {
    const [inputName, setInputName] = useState('')
    const [error, setError] = useState('')
    const {setName} = usePlayer()
    const navigate = useNavigate()

    /** Valida el nombre y, si es válido, lo guarda y va al juego. */
    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()

        const trimmed = inputName.trim()
        const validationError = validateName(trimmed)
        if (validationError) {
            setError(validationError)
            return
        }

        setName(trimmed)
        navigate('/game')
    }

    return (
        <main className="page page--center">
            <h1 className="title">🐹 Toca al topo</h1>
            <form className="form" onSubmit={handleSubmit} noValidate>
                <label className="label" htmlFor="player-name">
                    Nombre
                </label>
                <input
                    className="input"
                    id="player-name"
                    value={inputName}
                    onChange={(event) => {
                        setInputName(event.target.value)
                        setError('')
                    }}
                    maxLength={MAX_LENGTH}
                    autoComplete="nickname"
                    aria-invalid={!!error}
                    aria-describedby={error ? 'player-name-error' : undefined}
                />
                {error && (
                    <p className="error" id="player-name-error" role="alert">
                        {error}
                    </p>
                )}
                <button className="button" type="submit">
                    Jugar
                </button>
            </form>
        </main>
    )
}

export default HomePage
