import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import Hole from './Hole'

describe('Hole', () => {
    it('vacía se llama "Casilla N"', () => {
        render(<Hole index={0} target={null} onWhack={vi.fn()} />)

        expect(screen.getByRole('button', {name: 'Casilla 1'})).toBeInTheDocument()
    })

    it('con topo se llama "Casilla N: ¡topo!"', () => {
        render(<Hole index={0} target="mole" onWhack={vi.fn()} />)

        expect(screen.getByRole('button', {name: 'Casilla 1: ¡topo!'})).toBeInTheDocument()
    })

    it('con bomba se llama "Casilla N: ¡bomba!"', () => {
        render(<Hole index={0} target="bomb" onWhack={vi.fn()} />)

        expect(screen.getByRole('button', {name: 'Casilla 1: ¡bomba!'})).toBeInTheDocument()
    })

    it('al pulsarla muestra el texto que devuelve onWhack', async () => {
        const user = userEvent.setup()
        render(<Hole index={0} target="mole" onWhack={() => '+10'} />)

        await user.click(screen.getByRole('button'))

        expect(screen.getByText('+10')).toBeInTheDocument()
    })

    it('al pulsarla avisa con su índice', async () => {
        const user = userEvent.setup()
        const onWhack = vi.fn()
        render(<Hole index={4} target={null} onWhack={onWhack} />)

        await user.click(screen.getByRole('button'))

        expect(onWhack).toHaveBeenCalledWith(4)
    })
})
