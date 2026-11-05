import '@testing-library/jest-dom/vitest'
import {cleanup} from '@testing-library/react'
import {afterEach, vi} from 'vitest'

// Runs after every test so no test depends on what a previous one left behind.
afterEach(() => {
    cleanup() // unmount whatever was rendered
    localStorage.clear() // every test starts without a stored player
    vi.restoreAllMocks() // undo vi.spyOn (e.g. Math.random)
    vi.useRealTimers() // in case a test used fake timers
})
