# 🐹 Toca al topo

Aplicación web progresiva (PWA) del clásico juego "Toca al topo", desarrollada con React, TypeScript y Vite. Funciona sin conexión y se puede instalar en el móvil.

**Demo:** https://whack-a-mole-sigma-one.vercel.app

## Funcionamiento

1. **Home** (`/`): el jugador introduce su nombre y pulsa **Jugar**. El nombre se valida antes de continuar.
2. **Game** (`/game`): muestra el nombre, las vidas, el tiempo restante, los puntos, el selector de dificultad y el botón **Play**. Al pulsarlo aparece un tablero de 9 casillas en el que los topos cambian de sitio aleatoriamente. Cada acierto suma los puntos del nivel elegido. La partida dura **60 segundos** y se juega con **3 vidas**: de vez en cuando sale una **bomba** en lugar de un topo y golpearla resta una vida. Termina al agotarse el tiempo o las vidas, y muestra la puntuación final.

| Nivel | Cambio de posición | Puntos por acierto | Topos a la vez |
| ----- | -----------------: | -----------------: | -------------: |
| Bajo  |            1000 ms |                 10 |              1 |
| Medio |             750 ms |                 20 |              2 |
| Alto  |             500 ms |                 30 |              3 |

El tiempo y los puntos son los del enunciado; el número de topos simultáneos es una extensión (ver [Extras](#extras-implementados)).

Cualquier ruta que no exista redirige a la vista home. Entrar en `/game` sin haber registrado un nombre también redirige a home.

## Requisitos previos

- [Node.js](https://nodejs.org/) 22 o superior
- npm 10 o superior (viene con Node)

## Ejecución en local

```bash
git clone https://github.com/florianan7/whack-a-mole.git
cd whack-a-mole
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

Para probarla en un móvil de la misma red wifi:

```bash
npm run dev -- --host
```

y abre en el móvil la URL que muestra la consola (`http://192.168.x.x:5173`).

## Scripts disponibles

| Script                 | Qué hace                                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| `npm run dev`          | Servidor de desarrollo con recarga en caliente                                               |
| `npm run build`        | Comprueba los tipos y genera la versión de producción en `dist/` (incluye el Service Worker) |
| `npm run preview`      | Sirve la carpeta `dist/` en `http://localhost:4173`                                          |
| `npm test`             | Ejecuta los tests unitarios una vez                                                          |
| `npm run test:watch`   | Ejecuta los tests en modo vigilancia                                                         |
| `npm run coverage`     | Tests con informe de cobertura                                                               |
| `npm run test:e2e`     | Tests end-to-end con Playwright (hace el build y lo sirve él mismo)                          |
| `npm run test:e2e:ui`  | Los tests end-to-end en la interfaz interactiva de Playwright                                |
| `npm run lint`         | Análisis estático con ESLint                                                                 |
| `npm run typecheck`    | Comprobación de tipos con TypeScript                                                         |
| `npm run format`       | Formatea todo el código con Prettier                                                         |
| `npm run format:check` | Comprueba el formato sin modificar nada (se ejecuta en el CI)                                |

## Probar el modo offline

El Service Worker solo se genera en la versión de producción, por lo que no se puede probar con `npm run dev`:

```bash
npm run build
npm run preview
```

1. Abre `http://localhost:4173` **con conexión** y entra en el juego.
2. En las DevTools (F12) → _Application_ → _Service Workers_ comprueba que aparece uno en estado _activated_.
3. En la pestaña _Network_ marca **Offline** y recarga: la aplicación sigue cargando.

En un dispositivo real: abre la app desplegada una vez, activa el modo avión y vuelve a abrirla.

## Tests

Los tests unitarios usan [Vitest](https://vitest.dev/) y [Testing Library](https://testing-library.com/), y viven junto al archivo que prueban (`*.test.ts(x)`). Cubren:

- **Vistas**: `HomePage` (validación del nombre, navegación), `GamePage` (puntos por nivel, tablero, bombas y vidas, cuenta atrás, fin de partida, cambio de jugador, vibración) y las rutas de `App`.
- **Componentes**: `Board`, `Hole` y `DifficultySelector`.
- **Lógica**: el hook `useTargets` (intervalos, limpieza, aciertos, varias figuras) y las funciones puras `getRandomHoles`, `assignTargets` y `vibrate`.
- **Contexto**: `PlayerContext` (persistencia en `localStorage`).

Los tests buscan los elementos como lo haría un usuario (por rol y nombre accesible), de modo que también verifican la accesibilidad.

### Tests end-to-end

Con [Playwright](https://playwright.dev/) (`e2e/`), contra la versión de producción y en dos perfiles: Chrome de escritorio y un móvil Android (Pixel 7). Recorren los flujos completos: redirecciones de rutas, validación del nombre, registro y partida con puntuación, persistencia del jugador al recargar, cambio de jugador, y **el requisito offline**: tras abrir la app una vez, se corta la red y se comprueba que sigue cargando y se puede jugar. La primera vez hay que descargar el navegador:

```bash
npx playwright install chromium
npm run test:e2e
```

## Decisiones de diseño

- **Validación del nombre**: entre 2 y 15 caracteres tras eliminar espacios sobrantes; solo letras (de cualquier alfabeto, incluidas tildes y ñ), números y espacios. Un carácter no permitido se avisa al momento; la longitud se comprueba medio segundo después de dejar de escribir (_debounce_) y al enviar. Los errores se anuncian con `role="alert"` y se asocian al campo con `aria-describedby`.
- **Duración de la partida**: 60 segundos con cuenta atrás visible, o hasta perder las 3 vidas. El botón **Parar** permite abandonar antes. Cada partida empieza con 0 puntos, 3 vidas y el tiempo completo. Estas reglas viven en `src/game/rules.ts`.
- **Bombas**: cada figura que aparece es una bomba con un 20 % de probabilidad (`BOMB_CHANCE`) en lugar de un topo. Golpearla resta una vida; ignorarla no tiene coste. En el nivel Bajo, con una sola figura, a veces solo hay una bomba y toca esperar.
- **Los topos nunca repiten casilla**: `getRandomHoles` elige las casillas nuevas entre las que estaban libres, sacando una al azar y retirándola de la lista antes de sacar la siguiente, sin bucles de reintento. La función aleatoria se inyecta para que los tests sean deterministas.
- **Persistencia**: el nombre del jugador se guarda en `localStorage`, de modo que sobrevive a recargas y a abrir la app sin conexión. Si el almacenamiento no está disponible (modo privado), la app sigue funcionando en memoria.
- **Estado**: `PlayerContext` comparte el jugador entre vistas; el resto del estado vive en `GamePage` (puntos, vidas, tiempo, dificultad) y la lógica de las figuras en el hook `useTargets`, que limpia el intervalo al parar o al cambiar de nivel. Las figuras se guardan en un `Map` inmutable (casilla → topo o bomba): cada cambio crea uno nuevo para que React detecte la actualización. El fin de partida se deriva del estado (`!lives || !timeLeft`) en lugar de guardarse aparte.
- **Componentes de presentación**: `Board`, `Hole` y `DifficultySelector` no tienen estado propio; reciben todo por props y notifican mediante callbacks.
- **Estilos**: Sass con tokens de diseño (`src/styles/_tokens.scss`), diseño _mobile-first_, modo oscuro automático (`prefers-color-scheme`) y respeto a `prefers-reduced-motion`.
- **Accesibilidad**: elementos nativos (`<button>`, `<fieldset>` con radios), nombres accesibles en cada casilla, foco visible, objetivos táctiles de 48 px y marcador con `aria-live`.

## PWA

- Manifest con iconos (incluido _maskable_), `theme-color` y modo `standalone` para instalarla en el móvil.
- Service Worker generado con [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/) (Workbox) que precachea todos los recursos de la aplicación y se actualiza automáticamente al publicar una versión nueva.
- Cualquier navegación se resuelve con `index.html`, por lo que las rutas de React Router funcionan también sin conexión.

## Extras implementados

- **Varios topos a la vez**: el número de figuras simultáneas crece con la dificultad (1, 2 y 3). Cada topo puntúa una sola vez y desaparece al ser golpeado; en el siguiente intervalo todos cambian a casillas que estaban libres.
- **Bombas, vidas y tiempo**: partida de 60 segundos con 3 vidas; las bombas sustituyen a un topo y restan una vida. Al terminar se muestra la puntuación final y se puede volver a jugar.
- **Aviso flotante** en la casilla golpeada: `+10` al acertar un topo o `-1 ❤️` al pulsar una bomba, con una animación que sube y se desvanece.
- **Sonidos** al golpear un topo (pitido agudo) y una bomba (zumbido grave), generados con la Web Audio API (`src/game/sound.ts`): sin archivos de audio, funcionan offline y no pesan nada.
- **Vibración** al acertar un topo. En Android se usa `navigator.vibrate`. Safari en iOS no expone ninguna API de vibración a las webs, así que como **solución experimental** se usa el tic háptico del interruptor nativo (`<input type="checkbox" switch>`, iOS 17.4+): un interruptor invisible que se pulsa desde el código (`src/game/vibrate.ts`). Es un comportamiento no estándar que Apple puede cambiar en cualquier versión; si deja de funcionar, el juego sigue igual, solo sin vibración.
- **Cambio de jugador** desde la vista de juego.
- **Tests end-to-end** con Playwright, en escritorio y móvil, incluida la comprobación del modo offline.
- **Integración continua** con GitHub Actions: en cada _push_ y _pull request_ se ejecutan formato, lint, comprobación de tipos, tests unitarios, build y tests end-to-end (con el informe de Playwright como artefacto si fallan).
- **Despliegue continuo** en Vercel: cada _push_ a `main` publica la aplicación y cada _pull request_ genera una URL de previsualización.
- **Análisis estático** con ESLint (reglas de React Hooks y React Refresh) y TypeScript en modo estricto.
- **Formateo automático** con Prettier (integrado con ESLint mediante `eslint-config-prettier`) y `.editorconfig` para que cualquier editor use el mismo estilo. El CI rechaza código sin formatear.

## Estructura del proyecto

```
src/
├── components/        Componentes reutilizables (una carpeta por componente: .tsx, .scss, .test.tsx)
│   ├── Board/
│   ├── Hole/
│   └── DifficultySelector/
├── pages/             Una vista por ruta: HomePage, GamePage
├── hooks/             useTargets: lógica de topos y bombas
├── context/           PlayerContext: jugador compartido y persistido
├── game/              Reglas puras del juego: dificultad, duración, vidas, sorteo de casillas, bombas, vibración
├── styles/            Estilos globales en Sass: tokens, mixins, layout, formulario, botones
├── test-utils/        Configuración y utilidades de los tests
├── App.tsx            Tabla de rutas
└── main.tsx           Arranque de la aplicación
e2e/                   Tests end-to-end (Playwright)
```

## Tecnologías

React 19 · TypeScript · Vite · React Router · Sass · vite-plugin-pwa (Workbox) · Vitest · Testing Library · Playwright · ESLint · Prettier · GitHub Actions · Vercel
