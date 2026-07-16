# 🤖 Mackup Robot - Panel de Control HMI

Dashboard de control remoto para robot mesero con visualización multi-cámara, telemetría en tiempo real, panel de conducción avanzado, control remoto y gestión de layouts personalizados.

---

## 📋 Índice

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Arquitectura JavaScript](#arquitectura-javascript)
- [Funcionalidades](#funcionalidades)
  - [Cámaras](#cámaras)
  - [Gráficos de Telemetría](#gráficos-de-telemetría)
  - [Panel de Conducción](#panel-de-conducción)
  - [Layouts](#layouts)
  - [Sidebar Mesero Robot](#sidebar-mesero-robot)
  - [Controles](#controles)
- [API del Sidebar](#api-del-sidebar)
- [Personalización](#personalización)
- [Solución de Problemas](#solución-de-problemas)

---

## Descripción

Mackup Robot es un dashboard de control remoto diseñado para operar un robot mesero. Permite:

- **Visualizar hasta 6 feeds de cámara** en un grid flexible con drag & drop
- **Monitorear telemetría en tiempo real**: velocidad, packet loss, LiDAR, radar, GPS
- **Controlar el robot** mediante teclado, volante virtual o mando
- **Panel de conducción avanzado** (RD2 Teleop) con STM32, modos RC/TELEOP, marchas y auxiliares
- **Gestionar layouts personalizados** con posiciones, tamaños y visibilidad persistentes
- **Interactuar con el API del robot** (saludos, audio, configuración, proximidad)
- **Ventanas independientes** para sidebar y panel de conducción

El proyecto utiliza una arquitectura modular en JavaScript vanilla, separando la lógica en módulos especializados manteniendo compatibilidad con handlers inline.

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| **HTML5** | Estructura semántica, Canvas API |
| **CSS3** | Flexbox, Grid, Transiciones, Backdrop-filter, Media Queries |
| **Vanilla JavaScript** | Lógica modular, Eventos, Fetch API, MutationObserver |
| **Font Awesome 6** | Iconografía |
| **localStorage** | Persistencia de layouts |
| **Canvas 2D API** | Gráficos de telemetría y controles |

---

## Requisitos

- Navegador moderno con soporte para:
  - CSS `backdrop-filter`
  - CSS Custom Properties (`var()`)
  - HTML5 Drag & Drop API
  - Canvas 2D Context
  - ES6 (optional chaining, arrow functions)
- Servidor web local (recomendado para imágenes locales y módulos JS)
- **NO requiere** Node.js, build tools ni dependencias externas

---

## Instalación

1. Clonar o descargar el proyecto:
```bash
git clone <url-del-repo>
cd mackup_robot
```

2. El proyecto requiere un servidor web local para cargar los módulos JS:
```bash
# Python 3
python -m http.server 8080

# Node.js (si tienes npx)
npx serve .

# PHP
php -S localhost:8080
```

3. Abrir en navegador:
```
http://localhost:8080
```

---

## Configuración

### Variables de Entorno

No se requieren variables de entorno. La configuración se gestiona vía:

- **localStorage**: Layouts de cámaras y gráficos
- **Inputs del sidebar**: URL del robot, token, merchant ID, product ID
- **Panel de conducción**: Sliders de dirección, aceleración, freno y velocidad máxima

### Configuración Inicial

1. Abrir el panel de **Configuración** (icono ⚙️ en la esquina superior derecha)
2. Activar/desactivar cámaras y gráficos según necesidad
3. Seleccionar tipo de control (Teclado / Volante / Mando)
4. Activar **Modo Edición** (icono 🔒) para mover y redimensionar overlays
5. (Opcional) Abrir sidebar **Mesero Robot** para configurar URL del API
6. (Opcional) Abrir **Panel de Conducción** para control STM32

---

## Ejecución

### Modo Desarrollo
```bash
# Servir con recarga automática (Live Server en VS Code recomendado)
# O simplemente abrir index.html directamente desde un servidor local
```

### Modo Producción
- Copiar `index.html`, la carpeta `js/` y `assets/` al servidor web
- Asegurar que las imágenes de cámaras y el mando estén accesibles
- Verificar que los archivos JS tengan los permisos correctos de lectura

---

## Estructura del Proyecto

```
mackup_robot/
├── index.html              # Estructura HTML y CSS inline
├── js/                     # Módulos JavaScript
│   ├── state.js            # Variables globales compartidas
│   ├── utils.js            # Utilidades (showToast)
│   ├── cameras.js          # Grid de cámaras, drag & drop, resize
│   ├── controls.js         # Selector de control, modal de bindings
│   ├── layouts.js          # Guardar/cargar layouts en localStorage
│   ├── ui.js               # Dropdowns, modo edición, settings
│   ├── init.js             # Punto de entrada e inicialización
│   ├── driving/
│   │   ├── driving-panel.js    # Lógica del panel de conducción
│   │   ├── aux-controls.js     # Auxiliares, micrófono, bocina
│   │   └── driving-popout.js   # Pop-out del panel de conducción
│   ├── overlays/
│   │   ├── accel-graph.js        # Velocímetro circular
│   │   ├── packet-loss-graph.js  # Gráfico de packet loss
│   │   ├── lidar-graph.js        # LiDAR 2D
│   │   ├── radar-front-graph.js  # Radar frontal FI/FC/FD
│   │   ├── lidar-fusion-graph.js # Fusión LiDAR + Radar
│   │   ├── gps-graph.js          # GPS / Navegación
│   │   ├── steering-wheel.js     # Volante virtual
│   │   ├── gamepad-control.js    # Mando virtual
│   │   ├── handbrake.js          # Freno de mano
│   │   ├── wasd-keys.js          # Teclas WASD
│   │   └── graph-drag-resize.js  # Drag & resize de overlays
│   └── sidebar/
│       ├── sidebar-api.js      # API REST, conexión, audio
│       └── sidebar-popout.js   # Pop-out del sidebar
├── assets/
│   └── imgs/
│       ├── mando_ofi.png   # Imagen del mando PSP
│       └── ...             # Otras imágenes de controles
└── README.md               # Este archivo
```

---

## Arquitectura JavaScript

### Orden de Carga

Los scripts deben cargarse en este orden específico en el HTML:

```html
<!-- 1. Estado global (DEBE IR PRIMERO) -->
<script src="js/state.js"></script>

<!-- 2. Utilidades -->
<script src="js/utils.js"></script>

<!-- 3. Overlays / Gráficos -->
<script src="js/overlays/accel-graph.js"></script>
<script src="js/overlays/packet-loss-graph.js"></script>
<script src="js/overlays/lidar-graph.js"></script>
<script src="js/overlays/radar-front-graph.js"></script>
<script src="js/overlays/lidar-fusion-graph.js"></script>
<script src="js/overlays/gps-graph.js"></script>
<script src="js/overlays/steering-wheel.js"></script>
<script src="js/overlays/gamepad-control.js"></script>
<script src="js/overlays/handbrake.js"></script>
<script src="js/overlays/wasd-keys.js"></script>
<script src="js/overlays/graph-drag-resize.js"></script>

<!-- 4. Cámaras -->
<script src="js/cameras.js"></script>

<!-- 5. Controles -->
<script src="js/controls.js"></script>

<!-- 6. Layouts -->
<script src="js/layouts.js"></script>

<!-- 7. Panel de Conducción -->
<script src="js/driving/aux-controls.js"></script>
<script src="js/driving/driving-panel.js"></script>
<script src="js/driving/driving-popout.js"></script>

<!-- 8. Sidebar -->
<script src="js/sidebar/sidebar-api.js"></script>
<script src="js/sidebar/sidebar-popout.js"></script>

<!-- 9. UI General -->
<script src="js/ui.js"></script>

<!-- 10. Inicialización (DEBE IR AL FINAL) -->
<script src="js/init.js"></script>
```

### Convenciones

- **Variables globales**: Definidas en `state.js` usando `var` para compatibilidad con handlers inline (`onclick`)
- **Funciones globales**: Todas las funciones están en el scope global para permitir `onclick="toggleAux(this)"`
- **Inicialización**: `init.js` orquesta el arranque llamando a cada módulo en el orden correcto
- **Sin build tools**: Carga directa de archivos JS sin bundling ni transpilación

---

## Funcionalidades

### Cámaras

#### Grid de Cámaras
- **Hasta 6 cámaras** simultáneas en un grid flexible
- Layouts automáticos según cantidad de cámaras visibles:
  - 1 cámara: pantalla completa
  - 2 cámaras: 50/50 horizontal
  - 3-4 cámaras: grid 2×2
  - 5-6 cámaras: grid 3×2

#### Arrastrar y Reordenar
- **Drag & Drop nativo**: Arrastrar cámaras para reordenarlas
- Requiere **Modo Edición** activado (icono 🔓)
- Visual feedback con borde punteado azul durante el arrastre
- Soltar sobre otra cámara para intercambiar posiciones

#### Redimensionar
- **3 handles de resize** por cámara:
  - Esquina inferior-derecha (SE): ancho + alto
  - Borde inferior (S): solo alto
  - Borde derecho (E): solo ancho
- Mínimo: 140×110 píxeles
- Tamaños personalizados persisten entre layouts
- Requiere **Modo Edición** activado

#### Abrir en Nueva Pestaña
- Icono 🔗 en la esquina superior derecha de cada cámara (visible al hacer hover)
- Abre la imagen de esa cámara en una pestaña nueva del navegador

#### Renombrar Cámaras
- **Doble-click** sobre el nombre de la cámara (ej: "CAM FRONT")
- Aparece input editable con borde azul
- `Enter` para guardar, `Escape` para cancelar
- Los nombres personalizados se guardan **por layout** (no globalmente)

#### Ocultar/Mostrar
- Desde el menú desplegable de cámaras (icono 📷)
- Checkbox para cada cámara
- Las cámaras ocultas no se renderizan en el grid

---

### Gráficos de Telemetría

Todos los gráficos son **arrastrables** y **redimensionables** en modo edición:
- Arrastrar desde cualquier punto del gráfico
- Redimensionar desde esquina SE o bordes S/E
- Los gráficos circulares (acelerómetro, volante, LiDAR) mantienen aspecto 1:1

#### Acelerómetro (Velocímetro)
- **Visualización**: Gauge circular con aguja azul
- **Rango**: 0-120 km/h
- **Arco de fondo**: Gris semitransparente
- **Número central**: Blanco semitransparente (75% opaco)
- **Posición inicial**: Centrado horizontal, top: 20px
- **Transparencia**: Fondo 85% transparente con blur

#### Packet Loss
- **Visualización**: Gráfico de línea con área bajo la curva
- **Datos**: Simulación de pérdida de paquetes (0-100%)
- **Colores**: Azul (normal), amarillo (>30%), rojo (>60%)
- **Posición inicial**: top: 80px, left: 20px

#### LiDAR
- **Visualización**: Escaneo circular 2D con obstáculos detectados
- **FOV**: 120° frontal
- **Rango**: 0-2 metros
- **Sweep animado**: Barra de escaneo que rota automáticamente
- **Posición inicial**: top: 280px, left: 20px

#### Radar Frontal
- **Visualización**: 3 sensores frontales (FI, FC, FD) en cm
- **Colores por distancia**:
  - Rojo: < 80 cm (peligro)
  - Amarillo: 80-150 cm (precaución)
  - Verde: > 150 cm (seguro)
- **Posición inicial**: Centrado horizontal, top: 20px

#### Fusión LiDAR + Radar
- **Visualización**: Combinación de escaneo LiDAR con datos de radar frontal
- **Indicadores de proximidad**: Alertas visuales cuando obstáculos están cerca
- **Posición inicial**: top: 540px, left: 20px

#### GPS / Navegación
- **Visualización**: Grid con rastro de posición y heading del robot
- **Trail animado**: Últimos 150 puntos con gradiente de opacidad
- **Indicador de heading**: Triángulo que apunta en la dirección actual
- **Posición inicial**: Centrado horizontal, top: 250px

#### Volante (Steering Wheel)
- **Visualización**: Volante circular con botones, dial y palancas
- **Interacción**: Simulación de rotación (-45° a 45°)
- **Escalado**: Todos los elementos escalan proporcionalmente al redimensionar

#### Mando (Gamepad)
- **Visualización**: Imagen del mando (`assets/imgs/mando_ofi.png`)
- **Escalado**: Imagen con `object-fit: contain` para adaptarse al contenedor

#### WASD (Teclado Virtual)
- **Visualización**: 4 teclas (W, A, S, D) en layout de cruz
- **Escalado**: Teclas escalan con variable CSS `--scale` basada en el ancho del contenedor
- **Feedback visual**: Teclas se iluminan en azul al presionar la tecla física correspondiente

#### Freno de Mano
- **Visualización**: Botón grande con estado activo/inactivo
- **Activación**: Click directo en el overlay
- **Efecto al activar**: Fondo rojo con animación de pulso, detiene dirección y aceleración
- **Posición inicial**: top: 80px, left: 20px

---

### Panel de Conducción

Panel lateral deslizable (480px) para control de conducción avanzada del robot vía STM32.

#### Modos de Conducción
- **RC**: Control remoto directo
- **TELEOP**: Teleoperación con feedback
- Toggle entre modos con botones en la parte superior

#### Controles Principales

| Control | Descripción | Rango |
|---|---|---|
| **Dirección** | Slider bidireccional | -1000 a +1000 |
| **Aceleración** | Barra de progreso | 0-1000 |
| **Freno** | Barra de progreso | 0-1000 |
| **Velocidad Máxima** | Slider porcentual | 0-100% |

#### Marchas
- **Retro (LB)**: Marcha atrás
- **Neutral**: Punto muerto
- **Avance (RB)**: Marcha adelante

#### Auxiliares
- **Luz frontal**: Toggle ON/OFF
- **Guiñador izquierdo**: Toggle ON/OFF
- **Guiñador derecho**: Toggle ON/OFF
- **Balizas**: Toggle ON/OFF
- **Destellador**: Toggle ON/OFF
- **Micrófono**: Toggle ON/OFF con indicador de estado
- **Abrir/Cerrar puerta**: Momentary (press/release)
- **Bocina**: Momentary con selector de tono (normal/suave/aguda)

#### Estado del Sistema
- **Mando USB**: Activo/Desactivado
- **STM32**: Encendido/Apagado
- **Parada de emergencia**: Botón rojo grande con confirmación
- **Timestamp**: Fecha/hora actual
- **Último TX**: Datos de telemetría enviados
- **Marcha real**: SAFE / RC / TELEOP

#### Simulación
- Simulación automática de valores cuando el panel está abierto
- Actualización cada 600ms con valores aleatorios realistas

#### Ventana Independiente
- Icono 🔗 en el header del panel
- **Abrir**: El panel se oculta de la ventana principal y aparece en una ventana pop-out (760×920px)
- **Responsive**: 4 breakpoints (<400px, 600px+, 900px+, 1300px+)
- **Cerrar pop-out**: Regresa automáticamente a la ventana principal
- **Polling**: Detecta cierre manual cada 500ms

---

### Layouts

#### Guardar Layout
1. Hacer click en el icono 💾 (Guardar)
2. Ingresar nombre del layout
3. Se guarda en `localStorage` con:
   - Posición y orden de cámaras
   - Tamaños (width/height) de cámaras
   - Visibilidad de cámaras (mostradas/ocultas)
   - **Nombres personalizados** de cámaras
   - Posición (top/left) de todos los gráficos
   - Tamaño (width/height) de todos los gráficos
   - Visibilidad de gráficos (checkboxes)

#### Cargar Layout
1. Hacer click en el icono 📂 (Layouts)
2. Seleccionar layout de la lista
3. Se restaura **todo** el estado:
   - Cámaras: orden, tamaño, visibilidad, nombres
   - Gráficos: posición, tamaño, visibilidad

#### Eliminar Layout
- Icono 🗑️ junto a cada layout guardado

#### Layouts Predefinidos
- **Default**: Restaura configuración inicial de fábrica
- **Clear All**: Oculta todo (cámaras y gráficos)

---

### Sidebar Mesero Robot

Panel lateral deslizable (320px) para controlar el robot vía API REST.

#### Conexión
- Input para URL del robot (ej: `http://192.168.1.100:8080`)
- Botón "Conectar" con test de ping/health
- Indicador de estado: 🔴 Offline / 🟡 Conectando / 🟢 Online

#### Controles Disponibles

| Categoría | Acción | Endpoint |
|---|---|---|
| **Detección** | Cerca | `POST /proximity/near` |
| | Lejos | `POST /proximity/away` |
| **Pantalla** | Saludar | `POST /greet` |
| | Producto | `POST /product` |
| | Cancelar Pago | `POST /cancel-payment` |
| **Audios** | Pregunta | `POST /play-question` |
| | Gracias | `POST /play-thanks` |
| | Comprar | `POST /play-buy` |
| | Orden | `POST /play-order` |
| | Atención | `POST /play-attention` |
| | Bandeja | `POST /play-collect-tray` |
| | Café | `POST /play-coffee` |
| | Detener | `POST /audio/stop` |
| **Audio Personalizado** | Reproducir archivo | `POST /audio/play/{asset}` |
| **Configuración** | Ver config | `GET /config` |
| | Guardar config | `PUT /config` |

#### Ventana Independiente
- Icono 🔗 en el header del sidebar
- **Abrir**: El sidebar se oculta de la ventana principal y aparece en una ventana pop-out (380×750px)
- **Cerrar pop-out**: El sidebar regresa automáticamente a la ventana principal
- **Cerrar manual (X)**: Detectado por polling cada 500ms, restaura sidebar en ventana principal
- Todas las funciones (conectar, endpoints, consola) funcionan igual en la ventana independiente

#### Consola
- Logs en tiempo real de todas las llamadas al API
- Timestamp en cada entrada
- Colores: info (gris), ok (verde), err (rojo)
- Botón "Limpiar" para vaciar la consola

---

### Controles

#### Teclado (WASD)
- **W**: Adelante / Acelerar
- **S**: Atrás / Frenar
- **A**: Izquierda
- **D**: Derecha
- Visualización en pantalla con teclas que se iluminan al presionar

#### Volante
- Simulación de rotación automática
- Botones virtuales: Y, B, G, X, A, R, L
- Dial rotativo de 5 posiciones
- Botón START central
- Palancas traseras (indicadores)

#### Mando
- Imagen del mando PSP con transparencia
- Visual estático (representación del control físico)

#### Configuración de Bindings
- Modal accesible desde el menú de configuración (icono ⚙️ junto a cada tipo de control)
- Muestra las teclas/botones asignados por defecto
- Visualización de posiciones de acciones en el control seleccionado

---

## API del Sidebar

### Endpoints Soportados

```
GET    /ping              → Test de conectividad
GET    /health            → Health check alternativo
POST   /proximity/near    → Activar sensor de proximidad (cerca)
POST   /proximity/away    → Desactivar sensor de proximidad (lejos)
POST   /greet             → Mostrar saludo en pantalla
POST   /product           → Mostrar producto en pantalla
POST   /cancel-payment    → Cancelar pago en pantalla
POST   /play-question     → Reproducir audio "pregunta"
POST   /play-thanks       → Reproducir audio "gracias"
POST   /play-buy          → Reproducir audio "comprar"
POST   /play-order        → Reproducir audio "orden"
POST   /play-attention    → Reproducir audio "atención"
POST   /play-collect-tray → Reproducir audio "bandeja"
POST   /play-coffee       → Reproducir audio "café"
POST   /audio/stop        → Detener audio actual
POST   /audio/play/{asset}?volume={v}&force={f} → Audio personalizado
GET    /config            → Obtener configuración actual
PUT    /config            → Guardar configuración (JSON body)
```

### Configuración PUT

```json
{
  "base_url": "https://api.ejemplo.com",
  "token": "BearerToken123",
  "merchant_id": 42,
  "product_id": 7
}
```

---

## Personalización

### CSS Custom Properties

| Variable | Valor por defecto | Descripción |
|---|---|---|
| `--scale` | `1` | Escala de teclas WASD |

### Modificar Imágenes

- **Cámaras**: Cambiar URLs en los elementos `<img>` dentro de `.cam-body`
- **Mando**: Reemplazar `assets/imgs/mando_ofi.png`

### Colores Principales

| Uso | Color |
|---|---|
| Fondo principal | `#0d1117` |
| Acento (azul) | `#58a6ff` |
| Texto principal | `#c9d1d9` |
| Éxito | `#238636` |
| Error | `#da3633` |
| Advertencia | `#d29922` |

---

## Solución de Problemas

### Las cámaras no se muestran
- Verificar que los checkboxes en el menú de cámaras estén activados
- Revisar que las URLs de las imágenes sean accesibles
- Verificar que **Modo Edición** esté activado para drag & drop

### Los gráficos no aparecen al cargar
- Verificar que los checkboxes correspondientes en Configuración estén activados
- Los gráficos de control (volante/mando/WASD) dependen del radio button seleccionado
- El panel de conducción requiere su checkbox específico en Configuración

### El sidebar no conecta
- Verificar que la URL del robot incluya `http://` y el puerto correcto
- Comprobar que el robot esté en la misma red
- Revisar CORS en el servidor del robot

### Los layouts no se guardan
- Verificar que `localStorage` no esté deshabilitado en el navegador
- Limpiar `localStorage` si está corrupto: `localStorage.removeItem('camera_layouts')`

### El volante/mando no escala al redimensionar
- Recargar la página (los gráficos se redibujan automáticamente al resize)

### Los scripts no cargan
- Verificar que el servidor web esté corriendo (no abrir `index.html` directamente con `file://`)
- Revisar la consola del navegador (F12) para errores 404 en archivos JS
- Verificar que el orden de carga sea el correcto (state.js primero, init.js al final)

### El panel de conducción no simula
- Verificar que el checkbox "Panel de conducción" esté activado en Configuración
- La simulación solo corre cuando el panel está visible

---

## Licencia

Proyecto privado - Uso interno.

---

## Autor

Diseño para el proyecto **Control Robot**.

---

*Última actualización: Julio 2026*
