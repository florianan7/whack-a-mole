import {useState, type SubmitEvent} from 'react'
import {useNavigate} from 'react-router-dom'
import {usePlayer} from '../context/PlayerContext'

const MIN_LENGTH = 2
const MAX_LENGTH = 15
// Letters of any alphabet (accents, ñ...), digits and spaces.
const VALID_NAME = /^[\p{L}\p{N} ]+$/u

/**
 * Validates a (trimmed) player name.
 * Returns the error message to show, or '' when the name is valid.
 * Kept outside the component so it can be unit tested on its own.
 */
function validateName(name: string): string {
    if (name.length < MIN_LENGTH || name.length > MAX_LENGTH) {
        return `El nombre debe tener entre ${MIN_LENGTH} y ${MAX_LENGTH} caracteres`
    }
    if (!VALID_NAME.test(name)) {
        return 'El nombre solo puede contener letras, números y espacios'
    }
    return ''
}

/**
 * Default view: asks for the player name and, once valid, stores it
 * in the player context and navigates to the game.
 */
function HomePage() {
    const [inputName, setInputName] = useState('')
    const [error, setError] = useState('')
    const {setName} = usePlayer()
    const navigate = useNavigate()

    /** Validates the name on submit; only navigates when it is valid. */
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
            {/* noValidate: we show our own messages instead of the browser's native ones */}
            <form className="form" onSubmit={handleSubmit} noValidate>
                <label className="label" htmlFor="player-name">Nombre</label>
                <input
                    className="input"
                    id="player-name"
                    value={inputName}
                    onChange={(event) => {
                        setInputName(event.target.value)
                        setError('') // clear the error as soon as the user starts fixing it
                    }}
                    maxLength={MAX_LENGTH}
                    autoComplete="nickname"
                    aria-invalid={error !== ''}
                    aria-describedby={error ? 'player-name-error' : undefined}
                />
                {error && <p className="error" id="player-name-error" role="alert">{error}</p>}
                <button className="button" type="submit">Jugar</button>
            </form>
        </main>
    )
}

export default HomePage
