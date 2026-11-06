import {expect, test, type Page} from '@playwright/test'

/** Registra un jugador desde la vista home y llega a la vista de juego. */
async function registerPlayer(page: Page, name: string) {
    await page.goto('/')
    await page.getByLabel('Nombre').fill(name)
    await page.getByRole('button', {name: 'Jugar'}).click()
    await expect(page.getByRole('heading', {name})).toBeVisible()
}

test.describe('Home', () => {
    test('una ruta que no existe redirige a home', async ({page}) => {
        await page.goto('/no-existe')

        await expect(page).toHaveURL('/')
        await expect(page.getByLabel('Nombre')).toBeVisible()
    })

    test('no deja jugar sin un nombre válido', async ({page}) => {
        await page.goto('/')
        const play = page.getByRole('button', {name: 'Jugar'})

        await expect(play).toBeDisabled()

        await page.getByLabel('Nombre').fill('Ana!')

        await expect(page.getByRole('alert')).toContainText('solo puede contener letras')
        await expect(play).toBeDisabled()
    })

    test('entrar en /game sin jugador redirige a home', async ({page}) => {
        await page.goto('/game')

        await expect(page).toHaveURL('/')
    })
})

test.describe('Game', () => {
    test('registra al jugador, juega y suma puntos', async ({page}) => {
        await registerPlayer(page, 'Ana')

        await page.getByRole('radio', {name: 'Bajo'}).check()
        await page.getByRole('button', {name: 'Play'}).click()

        await expect(page.getByRole('group', {name: 'Tablero'})).toBeVisible()
        await expect(page.getByRole('button', {name: 'Parar'})).toBeVisible()

        await expect(async () => {
            await page
                .getByRole('button', {name: /¡topo!/})
                .first()
                .click({timeout: 2000})
            await expect(page.getByText(/Puntos: [1-9]/)).toBeVisible({timeout: 300})
        }).toPass({timeout: 15000})
    })

    test('el jugador sigue registrado tras recargar', async ({page}) => {
        await registerPlayer(page, 'Luis')

        await page.reload()

        await expect(page).toHaveURL('/game')
        await expect(page.getByRole('heading', {name: 'Luis'})).toBeVisible()
    })

    test('"Cambiar jugador" vuelve a home', async ({page}) => {
        await registerPlayer(page, 'Ana')

        await page.getByRole('button', {name: 'Cambiar jugador'}).click()

        await expect(page).toHaveURL('/')
        await expect(page.getByLabel('Nombre')).toBeVisible()
    })
})

test.describe('PWA', () => {
    test('funciona sin conexión tras haberla abierto una vez', async ({page, context}) => {
        await registerPlayer(page, 'Ana')
        await page.evaluate(() => navigator.serviceWorker.ready)

        await context.setOffline(true)
        await page.reload()

        await expect(page.getByRole('heading', {name: 'Ana'})).toBeVisible()
        await page.getByRole('button', {name: 'Play'}).click()
        await expect(page.getByRole('group', {name: 'Tablero'})).toBeVisible()
    })

    test('expone el manifest de la aplicación', async ({page}) => {
        await page.goto('/')

        const manifest = await page.request.get('/manifest.webmanifest')

        expect(manifest.ok()).toBe(true)
        expect(await manifest.json()).toMatchObject({name: 'Toca al topo', display: 'standalone'})
    })
})
