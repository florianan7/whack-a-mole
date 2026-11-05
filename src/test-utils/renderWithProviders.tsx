import type {ReactElement} from 'react'
import {render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {PlayerProvider} from '../context/PlayerContext'

interface Options {
    route?: string
}

/**
 * Renders a component with the same wrappers as main.tsx (router + player context),
 * starting at the given route. MemoryRouter keeps the URL in memory, so tests
 * don't touch the real browser history.
 */
export function renderWithProviders(ui: ReactElement, {route = '/'}: Options = {}) {
    return render(
        <MemoryRouter initialEntries={[route]}>
            <PlayerProvider>{ui}</PlayerProvider>
        </MemoryRouter>,
    )
}
