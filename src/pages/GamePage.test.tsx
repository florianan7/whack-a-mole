import {act, fireEvent, screen} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import App from '../App'
import {STORAGE_KEY} from '../context/PlayerContext'
import {renderWithProviders} from '../test-utils/renderWithProviders'

function renderGameAs(name: string) {
    localStorage.setItem(STORAGE_KEY, name)
    return renderWithProviders(<App />, {route: '/game'})
}

function play() {
    fireEvent.click(screen.getByRole('button', {name: 'Play'}))
}

describe('GamePage', () => {
    beforeEach(() => {
        vi.useFakeTimers()
        vi.spyOn(Math, 'random').mockReturnValue(0)
    })

    it('muestra el nombre, las vidas, el tiempo, los puntos y el botón Play', () => {
        renderGameAs('Ana')

        expect(screen.getByRole('heading', {name: 'Ana'})).toBeInTheDocument()
        expect(screen.getByLabelText('Vidas: 3')).toBeInTheDocument()
        expect(screen.getByText(/60 s/)).toBeInTheDocument()
        expect(screen.getByText('Puntos: 0')).toBeInTheDocument()
        expect(screen.getByRole('button', {name: 'Play'})).toBeInTheDocument()
    })

    it('no muestra el tablero hasta pulsar Play', () => {
        renderGameAs('Ana')
        expect(screen.queryByRole('button', {name: /Casilla/})).not.toBeInTheDocument()

        play()

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
            play()
            act(() => vi.advanceTimersByTime(intervalMs))

            const visibleMoles = screen.getAllByRole('button', {name: /¡topo!/})
            expect(visibleMoles).toHaveLength(moles)

            fireEvent.click(visibleMoles[0])

            expect(screen.getByText(`Puntos: ${points}`)).toBeInTheDocument()
            expect(screen.getByText(`+${points}`)).toBeInTheDocument()
        },
    )

    it('cada topo de la pantalla puntúa una sola vez', () => {
        renderGameAs('Ana')

        fireEvent.click(screen.getByRole('radio', {name: 'Alto'}))
        play()
        act(() => vi.advanceTimersByTime(500))

        const [first, second] = screen.getAllByRole('button', {name: /¡topo!/})
        fireEvent.click(first)
        fireEvent.click(first)
        fireEvent.click(second)

        expect(screen.getByText('Puntos: 60')).toBeInTheDocument()
    })

    it('no suma puntos al pulsar una casilla vacía', () => {
        renderGameAs('Ana')

        play()
        act(() => vi.advanceTimersByTime(1000))
        fireEvent.click(screen.getByRole('button', {name: 'Casilla 9'}))

        expect(screen.getByText('Puntos: 0')).toBeInTheDocument()
    })

    it('golpear una bomba resta una vida', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.9)
        renderGameAs('Ana')

        play()
        act(() => vi.advanceTimersByTime(1000))
        fireEvent.click(screen.getByRole('button', {name: /¡bomba!/}))

        expect(screen.getByLabelText('Vidas: 2')).toBeInTheDocument()
        expect(screen.getByText('Puntos: 0')).toBeInTheDocument()
        expect(screen.getByText('-1 ❤️')).toBeInTheDocument()
    })

    it('sin vidas termina la partida', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.9)
        renderGameAs('Ana')
        play()

        for (let i = 0; i < 3; i++) {
            act(() => vi.advanceTimersByTime(1000))
            fireEvent.click(screen.getByRole('button', {name: /¡bomba!/}))
        }

        expect(screen.getByRole('status')).toHaveTextContent('Te has quedado sin vidas')
        expect(screen.queryByRole('button', {name: /Casilla/})).not.toBeInTheDocument()
        expect(screen.getByRole('button', {name: 'Play'})).toBeInTheDocument()
    })

    it('descuenta el tiempo cada segundo', () => {
        renderGameAs('Ana')

        play()
        act(() => vi.advanceTimersByTime(1000))

        expect(screen.getByText(/59 s/)).toBeInTheDocument()
    })

    it('al acabar el tiempo termina la partida con los puntos conseguidos', () => {
        renderGameAs('Ana')

        play()
        act(() => vi.advanceTimersByTime(1000))
        fireEvent.click(screen.getByRole('button', {name: /¡topo!/}))
        act(() => vi.advanceTimersByTime(59000))

        expect(screen.getByRole('status')).toHaveTextContent('Se acabó el tiempo')
        expect(screen.getByRole('status')).toHaveTextContent('10 puntos')
        expect(screen.getByText(/0 s/)).toBeInTheDocument()
        expect(screen.queryByRole('button', {name: /Casilla/})).not.toBeInTheDocument()
    })

    it('Play tras terminar empieza una partida nueva', () => {
        renderGameAs('Ana')
        play()
        act(() => vi.advanceTimersByTime(60000))

        play()

        expect(screen.queryByRole('status')).not.toBeInTheDocument()
        expect(screen.getByLabelText('Vidas: 3')).toBeInTheDocument()
        expect(screen.getByText(/60 s/)).toBeInTheDocument()
        expect(screen.getByText('Puntos: 0')).toBeInTheDocument()
    })

    it('no permite cambiar la dificultad durante la partida', () => {
        renderGameAs('Ana')

        play()

        expect(screen.getByRole('radio', {name: 'Alto'})).toBeDisabled()
    })

    it('al pulsar Parar esconde el tablero', () => {
        renderGameAs('Ana')

        play()
        fireEvent.click(screen.getByRole('button', {name: 'Parar'}))

        expect(screen.queryByRole('button', {name: /Casilla/})).not.toBeInTheDocument()
        expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })

    it('los puntos vuelven a 0 al empezar una partida nueva', () => {
        renderGameAs('Ana')

        play()
        act(() => vi.advanceTimersByTime(1000))
        fireEvent.click(screen.getByRole('button', {name: /¡topo!/}))
        expect(screen.getByText('Puntos: 10')).toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', {name: 'Parar'}))
        play()

        expect(screen.getByText('Puntos: 0')).toBeInTheDocument()
    })

    it('vibra al golpear un topo', () => {
        const vibrate = vi.fn()
        Object.defineProperty(navigator, 'vibrate', {value: vibrate, configurable: true})
        renderGameAs('Ana')

        play()
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

        play()

        expect(screen.getByRole('button', {name: 'Cambiar jugador'})).toBeDisabled()
    })
})
