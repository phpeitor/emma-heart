# Roles y contexto del proyecto

Guía de trabajo para mantener coherente la landing animada **Heart of Emma**.

## Contexto del proyecto

- Es una landing estática, sin framework ni proceso de build.
- La experiencia principal muestra a Emma en el centro y nombres de mujeres orbitando una figura geométrica.
- La página combina un video de fondo aleatorio, una imagen central con brillo, un logo animado y nombres generados desde JavaScript.
- La interfaz usa una estética romántica y luminosa sobre un fondo oscuro.
- Todo el contenido se sirve como archivos estáticos desde Apache o cualquier servidor HTTP local.
- Los nombres mostrados están en español.

## Estructura real

- `index.html`: documento base, video, logotipo, imagen central y contenedor de la órbita.
- `css/style.css`: layout, identidad visual, nombres animados y responsive styling.
- `css/logo.css`: estilos autocontenidos del componente de logo reutilizable.
- `js/index.js`: nombres, formas geométricas, animaciones y selección de video.
- `js/logo.js`: inicialización independiente del logo, partículas y lightbox.
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

- Mantener la creación de todos los nombres y de `Emma` desde la lista y el runtime.
- Mantener la selección aleatoria entre las cinco formas y los dos videos disponibles.
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
- No depender de la órbita, del video ni de la imagen central.
- Evitar listeners duplicados y exponer únicamente la inicialización necesaria.
- Conservar soporte para clic, teclado, `Escape` y `prefers-reduced-motion`.

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
- Los nombres se generan alrededor de una de las cinco figuras.
- `Emma` aparece resaltada respecto a los demás nombres.
- El logo abre y cierra el lightbox sin listeners duplicados.
- La experiencia sigue siendo usable con movimiento reducido y en pantallas pequeñas.
