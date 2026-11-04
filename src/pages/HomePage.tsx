import {useState, type SubmitEvent} from 'react'
import {useNavigate} from 'react-router-dom'
import {usePlayer} from '../context/PlayerContext'

const MIN_LENGTH = 2
const MAX_LENGTH = 15
const VALID_NAME = /^[\p{L}\p{N} ]+$/u

function validateName(name: string): string {
    if (name.length < MIN_LENGTH || name.length > MAX_LENGTH) {
        return `El nombre debe tener entre ${MIN_LENGTH} y ${MAX_LENGTH} caracteres`
    }
    if (!VALID_NAME.test(name)) {
        return 'El nombre solo puede contener letras, números y espacios'
    }
    return ''
}

function HomePage() {
    const [inputName, setInputName] = useState('')
    const [error, setError] = useState('')
    const {setName} = usePlayer()
    const navigate = useNavigate()

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
        <main>
            <h1>Toca al topo</h1>
            <form onSubmit={handleSubmit} noValidate>
                <label htmlFor="player-name">Nombre</label>
                <input
                    id="player-name"
                    value={inputName}
                    onChange={(event) => {
                        setInputName(event.target.value)
                        setError('')
                    }}
                    maxLength={MAX_LENGTH}
                    autoComplete="nickname"
                    aria-invalid={error !== ''}
                    aria-describedby={error ? 'player-name-error' : undefined}
                />
                {error && <p id="player-name-error" role="alert">{error}</p>}
                <button type="submit">Jugar</button>
            </form>
        </main>
    )
}

export default HomePage
