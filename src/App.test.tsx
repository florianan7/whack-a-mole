import {screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import App from './App'
import {STORAGE_KEY} from './context/PlayerContext'
import {renderWithProviders} from './test-utils/renderWithProviders'

describe('App (rutas)', () => {
    it('la ruta por defecto es la vista home', () => {
        renderWithProviders(<App />, {route: '/'})
        expect(screen.getByRole('heading', {name: /Toca al topo/})).toBeInTheDocument()
    })

    it('una ruta que no existe redirige a home', () => {
        renderWithProviders(<App />, {route: '/no-existe'})
        expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
    })

    it('entrar en /game sin jugador redirige a home', () => {
        renderWithProviders(<App />, {route: '/game'})
        expect(screen.getByLabelText('Nombre')).toBeInTheDocument()
    })

    it('entrar en /game con jugador guardado muestra el juego', () => {
        localStorage.setItem(STORAGE_KEY, 'Ana')
        renderWithProviders(<App />, {route: '/game'})
        expect(screen.getByRole('heading', {name: 'Ana'})).toBeInTheDocument()
    })
})
