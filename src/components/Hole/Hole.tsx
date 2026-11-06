import {useState} from 'react'
import type {Target} from '../../game/targets'

interface HoleProps {
    index: number
    target: Target | null
    onWhack: (index: number) => string | null
}

const FIGURES = {
    mole: {emoji: '🐹', label: '¡topo!'},
    bomb: {emoji: '💣', label: '¡bomba!'},
}

/** Una casilla del tablero, vacía o con un topo o una bomba; al golpearla muestra el resultado. */
function Hole({index, target, onWhack}: HoleProps) {
    const [popup, setPopup] = useState<{text: string; id: number} | null>(null)
    const figure = target && FIGURES[target]
    const label = `Casilla ${index + 1}${figure ? `: ${figure.label}` : ''}`

    /** Golpea la casilla y, si había algo, enseña el texto que devuelve el padre. */
    function handleClick() {
        const text = onWhack(index)
        setPopup(text ? {text, id: Date.now()} : null)
    }

    return (
        <button type="button" className="hole" onClick={handleClick} aria-label={label}>
            {figure && (
                <span className="hole__figure" aria-hidden="true">
                    {figure.emoji}
                </span>
            )}
            {popup && (
                <span
                    key={popup.id}
                    className="hole__popup"
                    aria-hidden="true"
                    onAnimationEnd={() => setPopup(null)}
                >
                    {popup.text}
                </span>
            )}
        </button>
    )
}

export default Hole
