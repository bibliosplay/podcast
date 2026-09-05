# 🎙️ Del Libro al Micrófono — Taller de Podcast

Guía interactiva de un taller de 6 sesiones para crear un podcast literario,
desarrollada para la **Biblioteca Pública Regional del Maule**. Cubre desde la
idea y el guion hasta la grabación, edición, ambientación sonora, arte de
portada y publicación en plataformas.

Sitio estático en HTML/CSS/JS puro, sin frameworks ni dependencias — se puede
abrir directamente en el navegador o servir desde cualquier hosting estático
(GitHub Pages, Netlify, Vercel, etc.).

## Estructura del proyecto

```
.
├── index.html          # Estructura y contenido del taller (6 sesiones + inicio)
├── css/
│   └── style.css        # Estilos, paleta de colores y diseño responsivo
├── js/
│   └── script.js         # Navegación por pestañas, temporizadores y progreso
└── README.md
```

## Cómo usarlo

No requiere instalación ni build. Basta con abrir `index.html` en un navegador,
o levantar un servidor estático simple para probarlo con rutas relativas:

```bash
python3 -m http.server 8000
# luego visita http://localhost:8000
```

## Funcionalidades

- **Navegación por pestañas** entre la portada y las 6 sesiones, con soporte
  de teclado (flechas ←/→) siguiendo el patrón ARIA de "tabs".
- **Barra de progreso** que se actualiza a medida que se visitan sesiones, y
  se conserva entre visitas usando `localStorage`.
- **Temporizadores** por actividad práctica (iniciar / pausar / reiniciar),
  con aviso de "tiempo terminado" accesible (sin usar `alert()` bloqueante).
- **Entregables simulados**: los formularios de subida validan que haya
  contenido y muestran una confirmación en pantalla. No hay backend: no se
  envía ni almacena ningún archivo real.
- Reproductores de `<audio>` de ejemplo (los `src="#"` son marcadores de
  posición — reemplázalos por tus propios archivos de audio).

## Paleta de colores

La paleta está inspirada en un estudio de grabación análogo dentro de una
biblioteca: papel envejecido, tinta y el latón cálido de los diales de radio
antiguos. Se eligió deliberadamente distinta al combo genérico "crema +
terracota" que es común en interfaces generadas automáticamente.

| Uso                       | Color     | Muestra |
|----------------------------|-----------|---------|
| Fondo general (papel)       | `#efead9` | ░ papel envejecido |
| Marca / botones (tinta)     | `#26344a` | ▓ tinta azul-gris |
| Marca oscura (header)       | `#141b29` | ▓ tinta muy oscura |
| Acento (latón / dial radio) | `#c98a3a` | ▓ latón cálido |
| Botón secundario (tinta clara) | `#4c5c74` | ▓ azul-gris medio |
| Texto principal             | `#211d19` | ▓ casi negro cálido |
| Éxito / entregables (musgo) | `#5c7a5a` sobre `#e7eee2` | verde musgo |
| Advertencia ("grabando")    | `#9c3b34` | rojo ladrillo apagado |

Todas las combinaciones de texto sobre fondo se verificaron contra los
mínimos de contraste **WCAG 2.1 AA** (4.5:1 para texto normal, 3:1 para texto
grande).

Las variables de color viven como *custom properties* en `:root` dentro de
`css/style.css`, por lo que ajustar la paleta completa solo requiere editar
esos valores en un único lugar.

## Accesibilidad

- Estructura semántica (`<header>`, `<nav>`, `<main>`) y patrón ARIA de tabs
  (`role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`).
- Estilos de foco visibles (`:focus-visible`) para navegación por teclado.
- Regiones `aria-live` para el progreso, los temporizadores y las
  confirmaciones de entrega.
- Todos los campos de formulario tienen `<label>` asociado.
- Se respeta `prefers-reduced-motion` para quienes prefieren menos animación.

## Personalización

- **Contenido:** cada sesión es un bloque `<div class="tab-content">` en
  `index.html`; se puede agregar o quitar sesiones actualizando también los
  botones de la barra de pestañas y el conteo de `totalSessions` (se calcula
  automáticamente contando los paneles `id^="sesion"`, así que no es necesario
  tocar el JS al agregar sesiones).
- **Audio real:** reemplaza los `<source src="#">` por rutas a tus archivos
  MP3 (por ejemplo `audio/sesion1-ejemplo1.mp3`).
- **Entrega de archivos real:** el formulario actual es una simulación en el
  cliente. Para recibir archivos de verdad hace falta conectar un backend o
  un servicio externo (formulario de Google, endpoint propio, etc.).

## Licencia

Pendiente de definir por la biblioteca / equipo del taller.
