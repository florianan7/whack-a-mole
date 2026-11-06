import {useEffect, useState, type ChangeEvent, type SubmitEvent} from 'react'
import {useNavigate} from 'react-router-dom'
import {usePlayer} from '../context/PlayerContext'

const MIN_LENGTH = 2
const MAX_LENGTH = 15
const VALID_NAME = /^[\p{L}\p{N} ]+$/u
const LENGTH_ERROR = `El nombre debe tener entre ${MIN_LENGTH} y ${MAX_LENGTH} caracteres`
const CHARACTERS_ERROR = 'El nombre solo puede contener letras, números y espacios'
const VALIDATION_DELAY_MS = 500

/** Devuelve el error de caracteres no permitidos, o '' si todos son válidos. */
function validateCharacters(name: string): string {
    return name && !VALID_NAME.test(name) ? CHARACTERS_ERROR : ''
}

/** Devuelve el mensaje de error de un nombre no válido, o '' si es válido. */
function validateName(name: string): string {
    if (name.length < MIN_LENGTH || name.length > MAX_LENGTH) {
        return LENGTH_ERROR
    }
    return validateCharacters(name)
}

/** Vista home: pide el nombre del jugador e inicia el juego. */
function HomePage() {
    const [inputName, setInputName] = useState('')
    const [error, setError] = useState('')
    const {setName} = usePlayer()
    const navigate = useNavigate()
    const trimmed = inputName.trim()
    const isValid = !validateName(trimmed)

    /** Valida el nombre completo cuando el usuario lleva un momento sin escribir. */
    useEffect(() => {
        if (!trimmed) {
            return
        }
        const timeoutId = setTimeout(() => setError(validateName(trimmed)), VALIDATION_DELAY_MS)
        return () => clearTimeout(timeoutId)
    }, [trimmed])

    /** Actualiza el nombre y avisa al momento si se escribe un carácter no permitido. */
    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        setInputName(event.target.value)
        setError(validateCharacters(event.target.value.trim()))
    }

    /** Guarda el nombre y va al juego. */
    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault()
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
                    onChange={handleChange}
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
                <button className="button" type="submit" disabled={!isValid}>
                    Jugar
                </button>
            </form>
        </main>
    )
}

export default HomePage
