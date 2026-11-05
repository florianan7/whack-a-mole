interface HoleProps {
    index: number
    hasMole: boolean
    onWhack: (index: number) => void
}

/**
 * A single hole. A real <button> so it works with keyboard and screen readers.
 * The accessible name says whether the mole is there; the emoji is hidden from
 * assistive tech because it would be read as "hamster".
 */
function Hole({index, hasMole, onWhack}: HoleProps) {
    const label = `Casilla ${index + 1}${hasMole ? ': ¡topo!' : ''}`
    return (
        <button type="button" className="hole" onClick={() => onWhack(index)} aria-label={label}>
            {hasMole && (
                <span className="hole__mole" aria-hidden="true">
                    🐹
                </span>
            )}
        </button>
    )
}

export default Hole
