# 🐹 Toca al topo

Aplicación web progresiva (PWA) del clásico juego "Toca al topo", desarrollada con React, TypeScript y Vite. Funciona sin conexión y se puede instalar en el móvil.

**Demo:** https://whack-a-mole-sigma-one.vercel.app

## Funcionamiento

1. **Home** (`/`): el jugador introduce su nombre y pulsa **Jugar**. El nombre se valida antes de continuar.
2. **Game** (`/game`): muestra el nombre, los puntos, el selector de dificultad y el botón **Play**. Al pulsarlo aparece un tablero de 9 casillas en el que los topos cambian de sitio aleatoriamente. Cada acierto suma los puntos del nivel elegido.

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

- **Vistas**: `HomePage` (validación del nombre, navegación), `GamePage` (puntos por nivel, tablero, cambio de jugador, vibración) y las rutas de `App`.
- **Componentes**: `Board`, `Hole` y `DifficultySelector`.
- **Lógica**: el hook `useMoles` (intervalos, limpieza, aciertos, varios topos) y la función pura `getRandomHoles`.
- **Contexto**: `PlayerContext` (persistencia en `localStorage`).

Los tests buscan los elementos como lo haría un usuario (por rol y nombre accesible), de modo que también verifican la accesibilidad.

## Decisiones de diseño

- **Validación del nombre**: entre 2 y 15 caracteres tras eliminar espacios sobrantes; solo letras (de cualquier alfabeto, incluidas tildes y ñ), números y espacios. Un carácter no permitido se avisa al momento; la longitud se comprueba medio segundo después de dejar de escribir (_debounce_) y al enviar. Los errores se anuncian con `role="alert"` y se asocian al campo con `aria-describedby`.
- **Duración de la partida**: el juego continúa hasta que el jugador pulsa **Parar**. Cada partida empieza con 0 puntos.
- **Los topos nunca repiten casilla**: `getRandomHoles` elige las casillas nuevas entre las que estaban libres, sacando una al azar y retirándola de la lista antes de sacar la siguiente, sin bucles de reintento. La función aleatoria se inyecta para que los tests sean deterministas.
- **Persistencia**: el nombre del jugador se guarda en `localStorage`, de modo que sobrevive a recargas y a abrir la app sin conexión. Si el almacenamiento no está disponible (modo privado), la app sigue funcionando en memoria.
- **Estado**: `PlayerContext` comparte el jugador entre vistas; el resto del estado vive en `GamePage` y la lógica de los topos en el hook `useMoles`, que limpia el intervalo al parar o al cambiar de nivel. Las posiciones se guardan en un `Set` inmutable: cada cambio crea uno nuevo para que React detecte la actualización.
- **Componentes de presentación**: `Board`, `Hole` y `DifficultySelector` no tienen estado propio; reciben todo por props y notifican mediante callbacks.
- **Estilos**: Sass con tokens de diseño (`src/styles/_tokens.scss`), diseño _mobile-first_, modo oscuro automático (`prefers-color-scheme`) y respeto a `prefers-reduced-motion`.
- **Accesibilidad**: elementos nativos (`<button>`, `<fieldset>` con radios), nombres accesibles en cada casilla, foco visible, objetivos táctiles de 48 px y marcador con `aria-live`.

## PWA

- Manifest con iconos (incluido _maskable_), `theme-color` y modo `standalone` para instalarla en el móvil.
- Service Worker generado con [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/) (Workbox) que precachea todos los recursos de la aplicación y se actualiza automáticamente al publicar una versión nueva.
- Cualquier navegación se resuelve con `index.html`, por lo que las rutas de React Router funcionan también sin conexión.

## Extras implementados

- **Varios topos a la vez**: el número de topos simultáneos crece con la dificultad (1, 2 y 3). Cada topo puntúa una sola vez y desaparece al ser golpeado; en el siguiente intervalo todos cambian a casillas que estaban libres.
- **Vibración** al acertar un topo (`navigator.vibrate`), en los dispositivos que la soportan.
- **Cambio de jugador** desde la vista de juego.
- **Integración continua** con GitHub Actions: en cada _push_ y _pull request_ se ejecutan lint, comprobación de tipos, tests y build.
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
├── hooks/             useMoles: lógica de los topos
├── context/           PlayerContext: jugador compartido y persistido
├── game/              Reglas puras del juego: dificultad, sorteo de casillas
├── styles/            Estilos globales en Sass: tokens, mixins, layout, formulario, botones
├── test-utils/        Configuración y utilidades de los tests
├── App.tsx            Tabla de rutas
└── main.tsx           Arranque de la aplicación
```

## Tecnologías

React 19 · TypeScript · Vite · React Router · Sass · vite-plugin-pwa (Workbox) · Vitest · Testing Library · ESLint · GitHub Actions · Vercel
