interface HoleProps {
    index: number
    hasMole: boolean
    onWhack: (index: number) => void
}

/** Una casilla del tablero, con o sin topo. */
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
