import '@testing-library/jest-dom/vitest'
import {cleanup} from '@testing-library/react'
import {afterEach, vi} from 'vitest'

/** Deja cada test con el DOM, el almacenamiento, los mocks y los timers limpios. */
afterEach(() => {
    cleanup()
    localStorage.clear()
    vi.restoreAllMocks()
    vi.useRealTimers()
})
