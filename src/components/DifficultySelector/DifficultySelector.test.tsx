import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import DifficultySelector from './DifficultySelector'

describe('DifficultySelector', () => {
    it('muestra los tres niveles y marca el seleccionado', () => {
        render(<DifficultySelector value="medium" onChange={vi.fn()} />)

        expect(screen.getByRole('radio', {name: 'Bajo'})).not.toBeChecked()
        expect(screen.getByRole('radio', {name: 'Medio'})).toBeChecked()
        expect(screen.getByRole('radio', {name: 'Alto'})).not.toBeChecked()
    })

    it('avisa con el nivel elegido al cambiar', async () => {
        const user = userEvent.setup()
        const onChange = vi.fn()
        render(<DifficultySelector value="low" onChange={onChange} />)

        await user.click(screen.getByRole('radio', {name: 'Alto'}))

        expect(onChange).toHaveBeenCalledWith('high')
    })

    it('desactiva todas las opciones cuando está deshabilitado', () => {
        render(<DifficultySelector value="low" onChange={vi.fn()} disabled />)

        for (const radio of screen.getAllByRole('radio')) {
            expect(radio).toBeDisabled()
        }
    })
})
