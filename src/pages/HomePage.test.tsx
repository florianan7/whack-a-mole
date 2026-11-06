import {act, fireEvent, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import App from '../App'
import {renderWithProviders} from '../test-utils/renderWithProviders'

describe('HomePage', () => {
    it('muestra el campo de nombre y el botón de jugar', () => {
        renderWithProviders(<App />)

        expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
        expect(screen.getByRole('button', {name: 'Jugar'})).toBeInTheDocument()
    })

    it('muestra un error si el nombre está vacío', async () => {
        const user = userEvent.setup()
        renderWithProviders(<App />)

        await user.click(screen.getByRole('button', {name: 'Jugar'}))

        expect(screen.getByRole('alert')).toHaveTextContent('entre 2 y 15 caracteres')
        expect(screen.getByLabelText('Nombre')).toHaveAttribute('aria-invalid', 'true')
    })

    it('no acepta un nombre de solo espacios', async () => {
        const user = userEvent.setup()
        renderWithProviders(<App />)

        await user.type(screen.getByLabelText('Nombre'), '     ')
        await user.click(screen.getByRole('button', {name: 'Jugar'}))

        expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('avisa al momento si se escribe un carácter no permitido', async () => {
        const user = userEvent.setup()
        renderWithProviders(<App />)

        await user.type(screen.getByLabelText('Nombre'), 'Ana!')

        expect(screen.getByRole('alert')).toHaveTextContent('solo puede contener letras')
    })

    it('avisa de la longitud al dejar de escribir, sin enviar', () => {
        vi.useFakeTimers()
        renderWithProviders(<App />)

        fireEvent.change(screen.getByLabelText('Nombre'), {target: {value: 'A'}})
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()

        act(() => vi.advanceTimersByTime(500))

        expect(screen.getByRole('alert')).toHaveTextContent('entre 2 y 15 caracteres')
    })

    it('muestra un error si el nombre tiene símbolos', async () => {
        const user = userEvent.setup()
        renderWithProviders(<App />)

        await user.type(screen.getByLabelText('Nombre'), 'Ana!')
        await user.click(screen.getByRole('button', {name: 'Jugar'}))

        expect(screen.getByRole('alert')).toHaveTextContent('solo puede contener letras')
    })

    it('borra el error al volver a escribir', async () => {
        const user = userEvent.setup()
        renderWithProviders(<App />)

        await user.click(screen.getByRole('button', {name: 'Jugar'}))
        await user.type(screen.getByLabelText('Nombre'), 'A')

        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('con un nombre válido (con tildes) va a la vista de juego', async () => {
        const user = userEvent.setup()
        renderWithProviders(<App />)

        await user.type(screen.getByLabelText('Nombre'), '  Iñaki  ')
        await user.keyboard('{Enter}')

        expect(screen.getByRole('heading', {name: 'Iñaki'})).toBeInTheDocument()
        expect(screen.getByRole('button', {name: 'Play'})).toBeInTheDocument()
    })
})
