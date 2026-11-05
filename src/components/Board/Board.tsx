import type {CSSProperties} from 'react'
import Hole from '../Hole'
import './Board.scss'

interface BoardProps {
    totalHoles: number
    molePosition: number | null
    onWhack: (index: number) => void
}

/**
 * Presentational grid of holes. Holds no state: it renders the mole where
 * `molePosition` says and forwards clicks to the parent through `onWhack`.
 */
function Board({totalHoles, molePosition, onWhack}: BoardProps) {
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
                    hasMole={index === molePosition}
                    onWhack={onWhack}
                />
            ))}
        </div>
    )
}

export default Board
