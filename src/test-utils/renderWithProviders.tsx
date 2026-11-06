import type {ReactElement} from 'react'
import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {PlayerProvider} from '../context/PlayerContext'

interface Options {
    route?: string
}

/** Renderiza un componente con el router y el contexto del jugador, empezando en `route`. */
export function renderWithProviders(ui: ReactElement, {route = '/'}: Options = {}) {
    return render(
        <MemoryRouter initialEntries={[route]}>
            <PlayerProvider>{ui}</PlayerProvider>
        </MemoryRouter>,
    )
}
