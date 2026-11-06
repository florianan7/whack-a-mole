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

    it('no deja jugar con el nombre vacío', () => {
        renderWithProviders(<App />)

        expect(screen.getByRole('button', {name: 'Jugar'})).toBeDisabled()
    })

    it('no deja jugar con un nombre de solo espacios', async () => {
        const user = userEvent.setup()
        renderWithProviders(<App />)

        await user.type(screen.getByLabelText('Nombre'), '     ')

        expect(screen.getByRole('button', {name: 'Jugar'})).toBeDisabled()
    })

    it('avisa al momento si se escribe un carácter no permitido y no deja jugar', async () => {
        const user = userEvent.setup()
        renderWithProviders(<App />)

        await user.type(screen.getByLabelText('Nombre'), 'Ana!')

        expect(screen.getByRole('alert')).toHaveTextContent('solo puede contener letras')
        expect(screen.getByLabelText('Nombre')).toHaveAttribute('aria-invalid', 'true')
        expect(screen.getByRole('button', {name: 'Jugar'})).toBeDisabled()
    })

    it('avisa de la longitud al dejar de escribir', () => {
        vi.useFakeTimers()
        renderWithProviders(<App />)

        fireEvent.change(screen.getByLabelText('Nombre'), {target: {value: 'A'}})
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()

        act(() => vi.advanceTimersByTime(500))

        expect(screen.getByRole('alert')).toHaveTextContent('entre 2 y 15 caracteres')
    })

    it('borra el error al volver a escribir', () => {
        vi.useFakeTimers()
        renderWithProviders(<App />)

        fireEvent.change(screen.getByLabelText('Nombre'), {target: {value: 'A'}})
        act(() => vi.advanceTimersByTime(500))
        expect(screen.getByRole('alert')).toBeInTheDocument()

        fireEvent.change(screen.getByLabelText('Nombre'), {target: {value: 'An'}})

        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('habilita el botón con un nombre válido', async () => {
        const user = userEvent.setup()
        renderWithProviders(<App />)

        await user.type(screen.getByLabelText('Nombre'), 'Ana')

        expect(screen.getByRole('button', {name: 'Jugar'})).toBeEnabled()
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
