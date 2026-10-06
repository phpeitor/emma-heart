# Reglas de desarrollo frontend

## Alcance

Este repositorio contiene **Heart of Emma**, una landing estática de una sola página. No usa Node.js, bundler ni framework: se ejecuta con HTML, CSS y JavaScript vanilla.

La experiencia visual incluye:

- Video local de fondo, elegido aleatoriamente entre `video1.mp4` y `video2.mp4`.
- Fotografía central de Emma con brillo y transición al pasar el cursor.
- Nombres de mujeres en español que recorren una trayectoria geométrica animada.
- Una forma seleccionada aleatoriamente entre corazón, estrella, círculo, triángulo y diamante.
- Logo interactivo con animación, partículas y lightbox.

## Archivos y responsabilidades

- `index.html`: estructura de la landing, video, logo, imagen central y contenedor de la órbita.
- `css/style.css`: layout, fondo, brillo de la imagen, tipografía y animaciones de los nombres.
- `css/logo.css`: estilos autocontenidos del componente interactivo del logo.
- `js/index.js`: lista de nombres, trayectorias, creación de elementos animados y selección del video.
- `js/logo.js`: inicialización del logo, partículas y lightbox.
- `resources/video1.mp4`, `resources/video2.mp4`: videos de fondo.
- `resources/logo.png`: identidad visual del sitio.
- `resources/emma1.png`, `resources/emma2.png`, `resources/emma3.png`: imágenes disponibles de Emma.
- `README.md`: instrucciones básicas de ejecución.

## Reglas HTML

- Mantener `lang="es"` y el viewport responsive.
- Mantener las rutas relativas porque el sitio se publica como archivos estáticos.
- Conservar `background-video`, `video-source`, `centered-image` y `orbit`, ya que los consume `js/index.js` o los estilos.
- Usar `alt` descriptivo en las imágenes y un `aria-label` claro para el logo interactivo.
- Mantener el logo con la estructura `.logo > .box > img`.
- No incrustar video o JavaScript grande directamente en `index.html` si puede permanecer en `resources/`, `css/` o `js/`.
- Evitar dependencias externas para una funcionalidad que pueda resolverse con la plataforma web.

## Componente de logo reutilizable

- Integrar incluyendo `css/logo.css` y `js/logo.js`.
- Personalizar `LOGO_CONFIG` al inicio de `js/logo.js` para cambiar los emojis de partículas y la reacción del logo.
- Usar la estructura mínima `.logo > .box > img`.
- El componente debe funcionar aunque el proyecto no tenga órbita, video u overlay.
- Mantener `role="button"`, `tabindex="0"` y un `aria-label` en el contenedor cuando el logo sea interactivo.
- No mover reglas del logo a `style.css` ni lógica del logo a `index.js`.

## Reglas CSS

- Mantener los estilos generales en `css/style.css`; no añadir estilos inline salvo propiedades dinámicas generadas por JavaScript.
- Usar clases e IDs existentes de forma consistente y evitar selectores innecesariamente específicos.
- Preservar el contraste entre el video, la fotografía central y los nombres.
- Mantener `#background-video` fijo detrás del contenido y `#orbit` centrado sobre la imagen.
- Mantener las animaciones basadas en `offset-path` y ofrecer una alternativa razonable si el navegador no lo soporta.
- Mantener el lenguaje visual romántico y luminoso: fondo oscuro, resplandores rosados/rojos y tipografía manuscrita.
- Mantener el diseño adaptable a viewport pequeños sin ocultar la imagen ni los nombres.
- Respetar `@media (prefers-reduced-motion: reduce)` al agregar o modificar animaciones.
- Usar rutas relativas correctas (`../resources/...`) desde `css/style.css`.
- No sustituir la identidad visual por estilos genéricos sin una razón explícita.

## Reglas JavaScript

- Mantener el código en `js/index.js` y usar JavaScript vanilla.
- Crear los nombres desde JavaScript a partir de la lista existente; no duplicarlos manualmente en `index.html`.
- Mantener las trayectorias como datos separados de la creación de elementos y de la selección aleatoria.
- Validar los elementos del DOM antes de utilizarlos si se modifica `index.html`.
- Mantener las propiedades dinámicas (`--i` y `offsetPath`) en JavaScript y la presentación en CSS.
- No ocultar errores con catches amplios ni fallbacks que aparenten que una funcionalidad se ejecutó.
- Mantener la reproducción de video compatible con políticas del navegador (`autoplay`, `muted`, `playsinline`).

## Recursos y ejecución

- Probar desde Apache o un servidor HTTP local, no depender únicamente de abrir `index.html` con `file://`.
- Verificar que los dos videos y los recursos gráficos devuelvan `HTTP 200`.
- No renombrar recursos sin actualizar todas sus referencias.
- No añadir archivos generados, credenciales ni datos sensibles al repositorio.

## QA mínima

- Abrir la landing en escritorio y móvil.
- Confirmar que el video se reproduce y que la imagen central queda visible.
- Confirmar que los nombres se generan y recorren la figura seleccionada.
- Confirmar que el logo abre y cierra el lightbox con clic, teclado, `Escape` y clic fuera.
- Revisar consola y red para detectar errores JavaScript o recursos faltantes.
- Probar con `prefers-reduced-motion` habilitado.
