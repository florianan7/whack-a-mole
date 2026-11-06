import {useId} from 'react'
import {DIFFICULTIES, DIFFICULTY_LEVELS, type Difficulty} from '../../game/difficulty'
import './DifficultySelector.scss'

interface DifficultySelectorProps {
    value: Difficulty
    onChange: (difficulty: Difficulty) => void
    disabled?: boolean
}

/** Grupo de radios para elegir el nivel de dificultad. */
function DifficultySelector({value, onChange, disabled = false}: DifficultySelectorProps) {
    const name = useId()

    return (
        <fieldset className="difficulty" disabled={disabled}>
            <legend className="difficulty__legend">Dificultad</legend>
            {DIFFICULTY_LEVELS.map((level) => (
                <label key={level} className="difficulty__option">
                    <input
                        className="difficulty__input"
                        type="radio"
                        name={name}
                        value={level}
                        checked={value === level}
                        onChange={() => onChange(level)}
                    />
                    {DIFFICULTIES[level].label}
                </label>
            ))}
        </fieldset>
    )
}

export default DifficultySelector
