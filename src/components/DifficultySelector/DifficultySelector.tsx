import {useId} from 'react'
import {DIFFICULTIES, DIFFICULTY_LEVELS, type Difficulty} from '../../game/difficulty'
import './DifficultySelector.scss'

interface DifficultySelectorProps {
    value: Difficulty
    onChange: (difficulty: Difficulty) => void
    disabled?: boolean
}

/**
 * Controlled radio group for the difficulty level. The parent owns the value;
 * this component only renders it and reports changes.
 * Levels and labels come from DIFFICULTIES, so adding a level needs no change here.
 */
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
