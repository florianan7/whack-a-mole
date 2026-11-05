import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import Hole from './Hole'

describe('Hole', () => {
    it('sin topo se llama "Casilla N"', () => {
        render(<Hole index={0} hasMole={false} onWhack={vi.fn()} />)

        expect(screen.getByRole('button', {name: 'Casilla 1'})).toBeInTheDocument()
    })

    it('con topo se llama "Casilla N: ¡topo!"', () => {
        render(<Hole index={0} hasMole={true} onWhack={vi.fn()} />)

        expect(screen.getByRole('button', {name: 'Casilla 1: ¡topo!'})).toBeInTheDocument()
    })

    it('al pulsarla avisa con su índice', async () => {
        const user = userEvent.setup()
        const onWhack = vi.fn()
        render(<Hole index={4} hasMole={false} onWhack={onWhack} />)

        await user.click(screen.getByRole('button'))

        expect(onWhack).toHaveBeenCalledWith(4)
    })
})
