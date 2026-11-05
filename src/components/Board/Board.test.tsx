import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import Board from './Board'

describe('Board', () => {
    it('pinta tantas casillas como se le indiquen', () => {
        render(<Board totalHoles={9} molePosition={null} onWhack={vi.fn()}/>)
        expect(screen.getAllByRole('button')).toHaveLength(9)
    })

    it('es un grupo accesible llamado Tablero', () => {
        render(<Board totalHoles={9} molePosition={null} onWhack={vi.fn()}/>)
        expect(screen.getByRole('group', {name: 'Tablero'})).toBeInTheDocument()
    })

    it('calcula las columnas según el número de casillas', () => {
        render(<Board totalHoles={16} molePosition={null} onWhack={vi.fn()}/>)
        expect(screen.getByRole('group')).toHaveStyle({'--columns': '4'})
    })

    it('muestra el topo solo en su casilla', () => {
        render(<Board totalHoles={9} molePosition={2} onWhack={vi.fn()}/>)

        const moles = screen.getAllByRole('button', {name: /¡topo!/})
        expect(moles).toHaveLength(1)
        expect(moles[0]).toHaveAccessibleName('Casilla 3: ¡topo!')
    })

    it('avisa del índice de la casilla pulsada', async () => {
        const user = userEvent.setup()
        const onWhack = vi.fn()
        render(<Board totalHoles={9} molePosition={null} onWhack={onWhack}/>)

        await user.click(screen.getByRole('button', {name: 'Casilla 5'}))

        expect(onWhack).toHaveBeenCalledWith(4)
    })
})
