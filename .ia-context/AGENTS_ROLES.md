# Roles y contexto del proyecto

Guía de trabajo para mantener coherente la landing animada **Heart of Emma**.

## Contexto del proyecto

- Es una landing estática, sin framework ni proceso de build.
- La experiencia principal muestra a Emma en el centro y nombres de mujeres orbitando una figura geométrica.
- La página combina un video de fondo aleatorio, una imagen central con brillo, un logo animado y nombres generados desde JavaScript.
- La interfaz usa una estética romántica y luminosa sobre un fondo oscuro.
- Incluye un panel gamer pixel para cambiar forma, efecto visual y pausa.
- Todo el contenido se sirve como archivos estáticos desde Apache o cualquier servidor HTTP local.
- Los nombres mostrados están en español.
- Es la landing del cumpleaños número 6 de Emma: incluye pastel con velitas, globos, confeti y canción (`fiesta.css` / `fiesta.js`).

## Estructura real

- `index.html`: documento base, video, logotipo, imagen central y contenedor de la órbita.
- `css/style.css`: layout, identidad visual, nombres animados y responsive styling.
- `css/logo.css`: estilos autocontenidos del componente de logo reutilizable.
- `css/fiesta.css`: pastel, velitas, globos, contador y capa de confeti.
- `js/index.js`: nombres, formas geométricas, animaciones y selección de video.
- `js/logo.js`: inicialización independiente del logo, partículas y lightbox.
- `js/fiesta.js`: confeti, globos, velitas (toque y micrófono) y canción con Web Audio.
- `resources/`: videos, logo e imágenes de Emma.
- `README.md`: instrucciones básicas del repositorio y enlaces a demos.
- `.ia-context/`: contexto y reglas para asistentes de desarrollo.

## Roles recomendados

### Agent HTML / UX

Responsable de la estructura de la landing y de la accesibilidad.

Trabaja en:

- `index.html`

Debe:

- Mantener la carga de `css/style.css`, `css/logo.css`, `js/index.js` y `js/logo.js`.
- Conservar `lang="es"`, el viewport y textos alternativos descriptivos.
- Mantener los identificadores que usa `index.js`: `background-video`, `video-source`, `centered-image` y `orbit`.
- Mantener los controles `shape-controls`, `effect-controls`, `selection-status` y `pause-control`.
- Mantener el logo como control accesible con `role="button"`, `tabindex` y `aria-label`.
- Evitar introducir markup innecesario o dependencias de frameworks.

### Agent CSS / Visual

Responsable de la identidad visual y las animaciones.

Trabaja en:

- `css/style.css`
- `css/logo.css`

Debe:

- Mantener la estética romántica y la legibilidad de los nombres sobre el video.
- Mantener el video detrás del contenido y la imagen central por encima de la órbita.
- Conservar las animaciones de `.love`, `.love_word` y `.love--highlight`.
- EMMA debe resaltar siempre sobre los demás nombres en todas las figuras y efectos (pastilla, brillo, latido, sin inclinación).
- Mantener `#centered-image` circular con `aspect-ratio: 1` y `object-fit: cover`; su tamaño sale de `--photo-size`.
- Usar las formas geométricas definidas en `PATHS` sin duplicar sus trazados en CSS.
- Respetar `prefers-reduced-motion` cuando se modifiquen animaciones.
- Mantener el layout usable en pantallas pequeñas.
- Referenciar recursos con rutas relativas a `resources/`.
- Mantener el estilo del logo dentro de `css/logo.css`; no volver a mezclarlo en los estilos de la landing.

### Agent JS / Animaciones

Responsable del comportamiento interactivo.

Trabaja en:

- `js/index.js`

Debe:

- Mantener la creación de todos los nombres y de `EMMA` desde la lista y el runtime; EMMA se intercala `EMMA_REPEAT` veces en posiciones equidistantes y el retraso usa `--total` (no un valor fijo por palabra).
- Mantener la selección aleatoria entre los dos videos disponibles; la forma y el efecto elegidos se guardan en `localStorage` (`emma-heart:prefs`) dentro de `try/catch`.
- Al cambiar de figura usar la transición `#orbit.is-switching` y omitirla con `prefers-reduced-motion`.
- La pausa detiene también el video de fondo.
- Aplicar `offset-path` únicamente cuando el navegador soporte CSS Motion Path.
- Comprobar que los elementos del DOM existan antes de usarlos si se modifica la estructura.
- Evitar acumular nodos o listeners si se vuelve a inicializar la órbita.
- Evitar dependencias adicionales y mantener JavaScript vanilla.

### Agent Logo / Componente

Responsable del logo interactivo reutilizable.

Trabaja en:

- `css/logo.css`
- `js/logo.js`

Debe:

- Mantener la integración basada en `.logo > .box > img`.
- Cambiar los emojis del componente únicamente desde `LOGO_CONFIG`, al inicio de `js/logo.js`.
- No depender de la órbita, del video ni de la imagen central.
- Evitar listeners duplicados y exponer únicamente la inicialización necesaria.
- Conservar soporte para clic, teclado, `Escape` y `prefers-reduced-motion`.
- El lightbox es `role="dialog"`: mueve el foco al botón cerrar y lo devuelve a quien lo abrió.
- `window.HalloweenLogo.lightbox(trigger, img, { modifier, closeLabel, content, onOpen, onClose })` es la API reutilizable.
- La tarjeta animada de la foto (`.photo-card`) se construye en `js/fiesta.js` (`buildPhotoCard`) y se estiliza en `css/fiesta.css`; no hornear GIFs ni imágenes nuevas.
- No generar partículas con la animación en pausa, la pestaña oculta o movimiento reducido.

### Agent Fiesta / Cumpleaños

Responsable de la experiencia de cumpleaños.

Trabaja en:

- `css/fiesta.css`
- `js/fiesta.js`

Debe:

- Cambiar nombre, edad, colores y sensibilidad solo desde `FIESTA_CONFIG`, al inicio de `js/fiesta.js`.
- Mantener las velitas como botones nativos con `aria-pressed` y `aria-label`, y el estado en `role="status"`.
- Mostrar el micrófono solo en contexto seguro y dejar siempre el toque como alternativa.
- Iniciar audio únicamente tras un gesto del usuario y sin archivos de audio externos.
- No crear globos ni confeti con `prefers-reduced-motion`, con la pestaña oculta o con la animación en pausa.
- Mantener los globos por debajo del panel de control (`z-index`) y limitar cuántos hay en pantalla.

### Agent Docs / IA Context

Responsable de que esta documentación refleje el código real.

Trabaja en:

- `.ia-context/`
- `README.md`

Debe:

- Actualizar las rutas y nombres de archivos cuando cambie la estructura.
- No documentar módulos, templates o librerías que no existan en el repositorio.
- Mantener las reglas concisas y accionables.

## Checklist final

- La landing abre correctamente desde Apache o un servidor HTTP local.
- El video de fondo, el logo y las imágenes de Emma cargan sin errores 404.
- Los nombres se generan alrededor de una de las seis figuras.
- Las seis velitas se apagan, cae confeti, suena la canción y se pueden volver a encender.
- `Emma` aparece resaltada respecto a los demás nombres.
- El logo abre y cierra el lightbox sin listeners duplicados.
- La experiencia sigue siendo usable con movimiento reducido y en pantallas pequeñas.
