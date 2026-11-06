import type {CSSProperties} from 'react'
import Hole from '../Hole'
import './Board.scss'

interface BoardProps {
    totalHoles: number
    molePositions: ReadonlySet<number>
    onWhack: (index: number) => void
}

/** Tablero cuadrado de casillas con un topo en cada una de las `molePositions`. */
function Board({totalHoles, molePositions, onWhack}: BoardProps) {
    const holes = Array.from({length: totalHoles}, (_, index) => index)
    const columns = Math.ceil(Math.sqrt(totalHoles))

    return (
        <div
            className="board"
            role="group"
            aria-label="Tablero"
            style={{'--columns': columns} as CSSProperties}
        >
            {holes.map((index) => (
                <Hole
                    key={index}
                    index={index}
                    hasMole={molePositions.has(index)}
                    onWhack={onWhack}
                />
            ))}
        </div>
    )
}

export default Board
