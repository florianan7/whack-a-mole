import type {CSSProperties} from 'react'
import type {Target} from '../../game/targets'
import Hole from '../Hole'
import './Board.scss'

interface BoardProps {
    totalHoles: number
    targets: ReadonlyMap<number, Target>
    onWhack: (index: number) => string | null
}

/** Tablero cuadrado de casillas con las figuras indicadas en `targets`. */
function Board({totalHoles, targets, onWhack}: BoardProps) {
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
                    target={targets.get(index) ?? null}
                    onWhack={onWhack}
                />
            ))}
        </div>
    )
}

export default Board
