import {act, fireEvent, screen} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import App from '../App'
import {STORAGE_KEY} from '../context/PlayerContext'
import {renderWithProviders} from '../test-utils/renderWithProviders'

function renderGameAs(name: string) {
    localStorage.setItem(STORAGE_KEY, name)
    return renderWithProviders(<App />, {route: '/game'})
}

describe('GamePage', () => {
    beforeEach(() => {
        vi.useFakeTimers()
        vi.spyOn(Math, 'random').mockReturnValue(0)
    })

    it('muestra el nombre del jugador, los puntos y el botón Play', () => {
        renderGameAs('Ana')

        expect(screen.getByRole('heading', {name: 'Ana'})).toBeInTheDocument()
        expect(screen.getByText('Puntos: 0')).toBeInTheDocument()
        expect(screen.getByRole('button', {name: 'Play'})).toBeInTheDocument()
    })

    it('no muestra el tablero hasta pulsar Play', () => {
        renderGameAs('Ana')
        expect(screen.queryByRole('button', {name: /Casilla/})).not.toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', {name: 'Play'}))

        expect(screen.getAllByRole('button', {name: /Casilla/})).toHaveLength(9)
        expect(screen.getByRole('button', {name: 'Parar'})).toBeInTheDocument()
    })

    it.each([
        {level: 'Bajo', intervalMs: 1000, points: 10, moles: 1},
        {level: 'Medio', intervalMs: 750, points: 20, moles: 2},
        {level: 'Alto', intervalMs: 500, points: 30, moles: 3},
    ])(
        'en nivel $level salen $moles topo(s) cada $intervalMs ms y cada uno da $points puntos',
        ({level, intervalMs, points, moles}) => {
            renderGameAs('Ana')

            fireEvent.click(screen.getByRole('radio', {name: level}))
            fireEvent.click(screen.getByRole('button', {name: 'Play'}))
            act(() => vi.advanceTimersByTime(intervalMs))

            const visibleMoles = screen.getAllByRole('button', {name: /¡topo!/})
            expect(visibleMoles).toHaveLength(moles)

            fireEvent.click(visibleMoles[0])

            expect(screen.getByText(`Puntos: ${points}`)).toBeInTheDocument()
        },
    )

    it('cada topo de la pantalla puntúa una sola vez', () => {
        renderGameAs('Ana')

        fireEvent.click(screen.getByRole('radio', {name: 'Alto'}))
        fireEvent.click(screen.getByRole('button', {name: 'Play'}))
        act(() => vi.advanceTimersByTime(500))

        const [first, second] = screen.getAllByRole('button', {name: /¡topo!/})
        fireEvent.click(first)
        fireEvent.click(first)
        fireEvent.click(second)

        expect(screen.getByText('Puntos: 60')).toBeInTheDocument()
    })

    it('no suma puntos al pulsar una casilla vacía', () => {
        renderGameAs('Ana')

        fireEvent.click(screen.getByRole('button', {name: 'Play'}))
        act(() => vi.advanceTimersByTime(1000))
        fireEvent.click(screen.getByRole('button', {name: 'Casilla 9'}))

        expect(screen.getByText('Puntos: 0')).toBeInTheDocument()
    })

    it('no permite cambiar la dificultad durante la partida', () => {
        renderGameAs('Ana')

        fireEvent.click(screen.getByRole('button', {name: 'Play'}))

        expect(screen.getByRole('radio', {name: 'Alto'})).toBeDisabled()
    })

    it('al pulsar Parar esconde el tablero', () => {
        renderGameAs('Ana')

        fireEvent.click(screen.getByRole('button', {name: 'Play'}))
        fireEvent.click(screen.getByRole('button', {name: 'Parar'}))

        expect(screen.queryByRole('button', {name: /Casilla/})).not.toBeInTheDocument()
    })

    it('los puntos vuelven a 0 al empezar una partida nueva', () => {
        renderGameAs('Ana')

        fireEvent.click(screen.getByRole('button', {name: 'Play'}))
        act(() => vi.advanceTimersByTime(1000))
        fireEvent.click(screen.getByRole('button', {name: /¡topo!/}))
        expect(screen.getByText('Puntos: 10')).toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', {name: 'Parar'}))
        fireEvent.click(screen.getByRole('button', {name: 'Play'}))

        expect(screen.getByText('Puntos: 0')).toBeInTheDocument()
    })

    it('vibra al golpear un topo', () => {
        const vibrate = vi.fn()
        Object.defineProperty(navigator, 'vibrate', {value: vibrate, configurable: true})
        renderGameAs('Ana')

        fireEvent.click(screen.getByRole('button', {name: 'Play'}))
        act(() => vi.advanceTimersByTime(1000))
        fireEvent.click(screen.getByRole('button', {name: /¡topo!/}))

        expect(vibrate).toHaveBeenCalledWith(50)
        delete (navigator as {vibrate?: unknown}).vibrate
    })

    it('"Cambiar jugador" olvida al jugador y vuelve a home', () => {
        renderGameAs('Ana')

        fireEvent.click(screen.getByRole('button', {name: 'Cambiar jugador'}))

        expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
        expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    })

    it('no permite cambiar de jugador durante la partida', () => {
        renderGameAs('Ana')

        fireEvent.click(screen.getByRole('button', {name: 'Play'}))

        expect(screen.getByRole('button', {name: 'Cambiar jugador'})).toBeDisabled()
    })
})
