# Analisis del Proyecto Control-Bot (React + Tailwind)

## Resumen del HTML Actual

El HTML actual es una **aplicacion monolitica de control remoto para robot** con ~6200 lineas que incluye:

- **Grid de camaras** (6 camaras configurables, drag & drop, resize)
- **Panel de conduccion** (RD2 Teleop) con controles de direccion, acelerador, freno, marchas
- **Sidebar de aplicaciones** (Mesero Robot) con deteccion, pantalla, audios, configuracion
- **Multiples graficos overlay** (aceleracion, packet loss, LiDAR, radar frontal, fusion LiDAR+radar, GPS)
- **Controles de entrada** (teclado WASD, volante, mando/gamepad)
- **Sistema de layouts** guardados en localStorage
- **Modo edicion** para reposicionar overlays
- **Pop-out windows** para sidebar y panel de conduccion
- **Modales de configuracion** de controles
- **Freno de mano** overlay
- **Comunicacion HTTP/WebSocket** con el robot

---

## 1. Estructura de Carpetas (Buenas Practicas)

```
control-bot/
|
|-- public/
|   |-- favicon.ico
|   |-- robots.txt
|   |-- manifest.json
|
|-- src/
|   |-- assets/
|   |   |-- images/
|   |   |   |-- mando_ofi.png
|   |   |   |-- logo.svg
|   |   |-- styles/
|   |       |-- globals.css          # Estilos globales Tailwind + custom
|   |
|   |-- components/
|   |   |-- ui/                      # Componentes UI reutilizables (atomicos)
|   |   |   |-- Button.tsx
|   |   |   |-- Slider.tsx
|   |   |   |-- Toggle.tsx
|   |   |   |-- Badge.tsx
|   |   |   |-- Modal.tsx
|   |   |   |-- Dropdown.tsx
|   |   |   |-- Tooltip.tsx
|   |   |   |-- ProgressBar.tsx
|   |   |   |-- IconButton.tsx
|   |   |   |-- Card.tsx
|   |   |   |-- Select.tsx
|   |   |   |-- Input.tsx
|   |   |   |-- Checkbox.tsx
|   |   |   |-- RadioGroup.tsx
|   |   |   |-- Toast.tsx
|   |   |   |-- index.ts             # barrel export
|   |   |
|   |   |-- layout/
|   |   |   |-- AppLayout.tsx        # Layout principal (flex container)
|   |   |   |-- OverlayControls.tsx  # Botones overlay superiores
|   |   |   |-- EditModeToggle.tsx
|   |   |
|   |   |-- camera/
|   |   |   |-- CameraGrid.tsx       # Grid principal de camaras
|   |   |   |-- CameraTile.tsx       # Tile individual de camara
|   |   |   |-- CameraHeader.tsx
|   |   |   |-- CameraBody.tsx
|   |   |   |-- CameraFooter.tsx
|   |   |   |-- CameraMenu.tsx       # Dropdown de visibilidad
|   |   |   |-- useCameraDrag.ts     # Hook para drag & drop
|   |   |   |-- useCameraResize.ts   # Hook para resize
|   |   |
|   |   |-- driving-panel/
|   |   |   |-- DrivingPanel.tsx     # Panel completo de conduccion
|   |   |   |-- DrivingHeader.tsx
|   |   |   |-- StatusIndicators.tsx # Mando, STM32, Canal, Microfono
|   |   |   |-- ConductionControl.tsx # Direccion, acelerador, freno
|   |   |   |-- DirectionSlider.tsx
|   |   |   |-- ThrottleBrake.tsx
|   |   |   |-- GearSelector.tsx     # Retro, Neutral, Avance
|   |   |   |-- MaxSpeedControl.tsx
|   |   |   |-- AuxControls.tsx      # Luces, guiñadores, balizas, puerta
|   |   |   |-- HornControl.tsx
|   |   |   |-- MandoUSB.tsx         # Estado del mando USB
|   |   |   |-- STM32Status.tsx      # Estado STM32
|   |   |   |-- TxRxDisplay.tsx
|   |   |   |-- EmergencyStop.tsx
|   |   |   |-- DrivingFooter.tsx
|   |   |
|   |   |-- sidebar/
|   |   |   |-- AppSidebar.tsx       # Sidebar de aplicaciones
|   |   |   |-- SidebarHeader.tsx
|   |   |   |-- ConnectionBar.tsx    # URL + Conectar
|   |   |   |-- DetectionBlock.tsx   # Cerca/Lejos
|   |   |   |-- ScreenBlock.tsx      # Saludar, Producto, Cancelar
|   |   |   |-- AudioBlock.tsx       # Audios predefinidos + custom
|   |   |   |-- ConfigBlock.tsx      # Configuracion del robot
|   |   |   |-- ConsoleLog.tsx       # Consola de logs
|   |   |
|   |   |-- graphs/
|   |   |   |-- GraphWrapper.tsx     # Wrapper reutilizable (drag + resize)
|   |   |   |-- AccelGraph.tsx       # Velocimetro
|   |   |   |-- PacketLossGraph.tsx
|   |   |   |-- LidarGraph.tsx
|   |   |   |-- RadarFrontGraph.tsx
|   |   |   |-- LidarFusionGraph.tsx
|   |   |   |-- GpsGraph.tsx
|   |   |   |-- useGraphDrag.ts
|   |   |   |-- useGraphResize.ts
|   |   |
|   |   |-- controls/
|   |   |   |-- WasdKeys.tsx         # Teclas WASD visuales
|   |   |   |-- SteeringWheel.tsx    # Volante (canvas)
|   |   |   |-- GamepadControl.tsx   # Mando (canvas/imagen)
|   |   |   |-- HandbrakeOverlay.tsx # Freno de mano
|   |   |   |-- ControlTypeSelector.tsx # Radio: teclado/volante/mando
|   |   |
|   |   |-- modals/
|   |   |   |-- ControlConfigModal.tsx # Modal de config de controles
|   |   |   |-- KeyBindingRow.tsx
|   |   |   |-- ControlImage.tsx     # Canvas con imagen del control
|   |   |
|   |   |-- menus/
|   |       |-- SettingsMenu.tsx     # Menu de ajustes (checkboxes)
|   |       |-- LayoutsMenu.tsx      # Menu de layouts guardados
|   |       |-- CamerasMenu.tsx      # Menu de visibilidad de camaras
|   |
|   |-- hooks/
|   |   |-- useToast.ts
|   |   |-- useLocalStorage.ts
|   |   |-- useEditMode.ts
|   |   |-- useDropdown.ts
|   |   |-- usePopout.ts             # Hook para ventanas pop-out
|   |   |-- useInterval.ts
|   |   |-- useWebSocket.ts
|   |   |-- useGamepad.ts            # Hook para Gamepad API
|   |   |-- useKeyboard.ts           # Hook para eventos de teclado
|   |   |-- useDrivingSimulation.ts
|   |   |-- useLayouts.ts            # CRUD de layouts
|   |
|   |-- services/
|   |   |-- robotApi.ts              # Llamadas HTTP al robot
|   |   |-- audioService.ts          # Reproduccion de audios
|   |   |-- configService.ts         # Gestion de configuracion
|   |   |-- websocketService.ts      # Conexion WebSocket
|   |
|   |-- stores/
|   |   |-- useCameraStore.ts        # Estado de camaras (Zustand)
|   |   |-- useDrivingStore.ts       # Estado del panel de conduccion
|   |   |-- useGraphStore.ts         # Estado de graficos
|   |   |-- useLayoutStore.ts        # Estado de layouts
|   |   |-- useSidebarStore.ts       # Estado del sidebar
|   |   |-- useControlStore.ts       # Estado de controles (bindings)
|   |   |-- useConnectionStore.ts    # Estado de conexion
|   |
|   |-- types/
|   |   |-- camera.ts
|   |   |-- driving.ts
|   |   |-- graph.ts
|   |   |-- layout.ts
|   |   |-- control.ts
|   |   |-- robot.ts
|   |   |-- index.ts
|   |
|   |-- constants/
|   |   |-- defaultBindings.ts
|   |   |-- cameraDefaults.ts
|   |   |-- graphConfig.ts
|   |   |-- apiEndpoints.ts
|   |
|   |-- utils/
|   |   |-- canvas.ts                # Utilidades de dibujo canvas
|   |   |-- math.ts                  # Calculos geometricos
|   |   |-- formatters.ts            # Formateo de valores
|   |   |-- storage.ts               # Helpers localStorage
|   |
|   |-- pages/
|   |   |-- Dashboard.tsx            # Pagina principal (unica)
|   |
|   |-- App.tsx
|   |-- main.tsx
|   |-- vite-env.d.ts
|
|-- .env
|-- .env.example
|-- .gitignore
|-- index.html
|-- package.json
|-- tailwind.config.ts
|-- tsconfig.json
|-- tsconfig.node.json
|-- vite.config.ts
|-- postcss.config.js
|-- README.md
```

---

## 2. Librerias Necesarias

### Core
| Libreria | Version | Proposito |
|---|---|---|
| `react` | ^18.3 | UI framework |
| `react-dom` | ^18.3 | DOM renderer |
| `typescript` | ^5.4 | Tipado estatico |

### Build & Dev
| Libreria | Version | Proposito |
|---|---|---|
| `vite` | ^5.x | Build tool |
| `@vitejs/plugin-react` | ^4.x | Plugin React para Vite |
| `tailwindcss` | ^3.4 | Utility-first CSS |
| `postcss` | ^8.x | Procesador CSS |
| `autoprefixer` | ^10.x | Prefijos CSS automaticos |

### Estado & Routing
| Libreria | Version | Proposito |
|---|---|---|
| `zustand` | ^4.5 | Estado global ligero |
| `react-router-dom` | ^6.x | Routing (futuro multi-vista) |

### UI & Iconos
| Libreria | Version | Proposito |
|---|---|---|
| `@fortawesome/fontawesome-free` | ^6.x | Iconos (ya se usa) |
| `clsx` | ^2.x | Conditional classNames |
| `tailwind-merge` | ^2.x | Merge de clases Tailwind |

### Drag & Drop / Resize
| Libreria | Version | Proposito |
|---|---|---|
| `@dnd-kit/core` | ^6.x | Drag & Drop moderno |
| `@dnd-kit/sortable` | ^8.x | Sortable lists |
| `react-resizable-panels` | ^2.x | Paneles redimensionables |

### Graficos / Canvas
| Libreria | Version | Proposito |
|---|---|---|
| `recharts` | ^2.x | Graficos de linea (packet loss) |
| O usar Canvas nativo con hooks | - | Para LiDAR, radar, velocimetro |

### Utilidades
| Libreria | Version | Proposito |
|---|---|---|
| `immer` | ^10.x | Inmutabilidad en stores |
| `date-fns` | ^3.x | Formateo de fechas |
| `react-hot-toast` | ^2.x | Notificaciones toast |

### HTTP & WebSocket
| Libreria | Version | Proposito |
|---|---|---|
| `axios` | ^1.x | Cliente HTTP (alternativa a fetch) |

### Gamepad API
| Libreria | Version | Proposito |
|---|---|---|
| `react-gamepad` | ^1.x | Hook para Gamepad API (o custom) |

### Comando de instalacion

```bash
npm create vite@latest control-bot -- --template react-ts
cd control-bot

npm install zustand react-router-dom clsx tailwind-merge \
  @dnd-kit/core @dnd-kit/sortable react-resizable-panels \
  recharts immer date-fns react-hot-toast axios \
  @fortawesome/fontawesome-free

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## 3. Historias de Usuario (HU)

### MODULO 1: Grid de Camaras

| ID | HU | Prioridad | Estimacion |
|---|---|---|---|
| **HU-01** | Como operador, quiero ver un grid de camaras en tiempo real para monitorear el entorno del robot | Alta | 3 dias |
| **HU-02** | Como operador, quiero mostrar/ocultar camaras individuales desde un menu dropdown | Alta | 1 dia |
| **HU-03** | Como operador, quiero arrastrar y reordenar las camaras en el grid (drag & drop) | Alta | 2 dias |
| **HU-04** | Como operador, quiero redimensionar cada camara individualmente (bordes SE, S, E) | Alta | 2 dias |
| **HU-05** | Como operador, quiero que el grid se reorganice automaticamente segun la cantidad de camaras visibles | Alta | 1 dia |
| **HU-06** | Como operador, quiero renombrar las camaras con doble-click en el nombre | Media | 1 dia |
| **HU-07** | Como operador, quiero ver el estado de cada camara (ONLINE/OFFLINE, FPS, latencia) | Media | 1 dia |
| **HU-08** | Como operador, quiero ver un badge "LIVE" en cada camara activa | Baja | 0.5 dias |
| **HU-09** | Como operador, quiero abrir una camara en una pestana/ventana nueva (pop-out) | Media | 1 dia |
| **HU-10** | Como operador, quiero que el grid sea responsive (mobile, tablet, desktop) | Alta | 2 dias |

### MODULO 2: Panel de Conduccion (RD2 Teleop)

| ID | HU | Prioridad | Estimacion |
|---|---|---|---|
| **HU-11** | Como operador, quiero abrir/cerrar un panel lateral de conduccion | Alta | 1 dia |
| **HU-12** | Como operador, quiero ver indicadores de estado (mando, STM32, canal, microfono) | Alta | 1 dia |
| **HU-13** | Como operador, quiero alternar entre modos RC y TELEOP | Alta | 1 dia |
| **HU-14** | Como operador, quiero controlar la direccion con un slider (-1000 a 1000) | Alta | 1 dia |
| **HU-15** | Como operador, quiero ver barras de progreso para acelerador y freno | Alta | 1 dia |
| **HU-16** | Como operador, quiero seleccionar marcha (Retro/Neutral/Avance) con botones | Alta | 1 dia |
| **HU-17** | Como operador, quiero limitar la velocidad maxima con un slider (0-100%) | Alta | 0.5 dias |
| **HU-18** | Como operador, quiero controlar auxiliares: luz frontal, guiñadores, balizas, destellador | Alta | 2 dias |
| **HU-19** | Como operador, quiero controlar el microfono (on/off) | Media | 0.5 dias |
| **HU-20** | Como operador, quiero abrir/cerrar puertas del robot (mantener presionado) | Alta | 1 dia |
| **HU-21** | Como operador, quiero seleccionar y activar sonidos de bocina | Media | 1 dia |
| **HU-22** | Como operador, quiero ver el estado del mando USB (ejes y botones en tiempo real) | Media | 2 dias |
| **HU-23** | Como operador, quiero ver el estado de la STM32 (marcha real, modo, failsafe, puerto) | Alta | 1 dia |
| **HU-24** | Como operador, quiero ver los ultimos mensajes TX/RX de comunicacion | Media | 1 dia |
| **HU-25** | Como operador, quiero activar una PARADA DE EMERGENCIA (neutral + freno maximo) | Critica | 1 dia |
| **HU-26** | Como operador, quiero encender/apagar la STM32 remotamente | Alta | 0.5 dias |
| **HU-27** | Como operador, quiero ver alertas cuando se pierde la conexion con el mando | Alta | 0.5 dias |
| **HU-28** | Como operador, quiero abrir el panel de conduccion en ventana independiente (pop-out) | Media | 2 dias |
| **HU-29** | Como operador, quiero que el panel se simule actualizando cada 600ms | Baja | 1 dia |

### MODULO 3: Sidebar de Aplicaciones (Mesero Robot)

| ID | HU | Prioridad | Estimacion |
|---|---|---|---|
| **HU-30** | Como operador, quiero abrir/cerrar un sidebar lateral de aplicaciones | Alta | 1 dia |
| **HU-31** | Como operador, quiero conectar al robot ingresando una URL base | Alta | 1 dia |
| **HU-32** | Como operador, quiero ver el estado de conexion (Online/Offline/Conectando) | Alta | 0.5 dias |
| **HU-33** | Como operador, quiero enviar comandos de deteccion (Cerca/Lejos) | Alta | 0.5 dias |
| **HU-34** | Como operador, quiero controlar la pantalla del robot (Saludar, Producto, Cancelar) | Alta | 1 dia |
| **HU-35** | Como operador, quiero reproducir audios predefinidos (Pregunta, Gracias, Comprar, Orden, Atencion, Bandeja, Cafe) | Alta | 1 dia |
| **HU-36** | Como operador, quiero detener la reproduccion de audio | Alta | 0.5 dias |
| **HU-37** | Como operador, quiero reproducir un audio personalizado con volumen y opcion de forzar | Media | 1 dia |
| **HU-38** | Como operador, quiero ver y actualizar la configuracion del robot (Base URL, Token, Merchant ID, Product ID) | Alta | 1 dia |
| **HU-39** | Como operador, quiero ver una consola de logs con las operaciones realizadas | Media | 1 dia |
| **HU-40** | Como operador, quiero limpiar la consola de logs | Baja | 0.5 dias |
| **HU-41** | Como operador, quiero abrir el sidebar en ventana independiente (pop-out) | Media | 2 dias |

### MODULO 4: Graficos y Visualizaciones Overlay

| ID | HU | Prioridad | Estimacion |
|---|---|---|---|
| **HU-42** | Como operador, quiero ver un velocimetro (aceleracion) con aguja animada | Media | 3 dias |
| **HU-43** | Como operador, quiero ver un grafico de packet loss en tiempo real (linea con gradiente) | Media | 2 dias |
| **HU-44** | Como operador, quiero ver un grafico LiDAR con barrido rotatorio y obstaculos | Alta | 4 dias |
| **HU-45** | Como operador, quiero ver un grafico de radar frontal (FI/FC/FD) con detecciones por color | Alta | 3 dias |
| **HU-46** | Como operador, quiero ver una fusion LiDAR + Radar en un solo grafico | Alta | 3 dias |
| **HU-47** | Como operador, quiero ver un mapa GPS con trail del robot y posicion actual | Media | 3 dias |
| **HU-48** | Como operador, quiero mostrar/ocultar cada grafico desde el menu de ajustes | Alta | 1 dia |
| **HU-49** | Como operador, quiero arrastrar los graficos a cualquier posicion de la pantalla (modo edicion) | Alta | 2 dias |
| **HU-50** | Como operador, quiero redimensionar los graficos (SE, S, E) en modo edicion | Alta | 2 dias |
| **HU-51** | Como operador, quiero que los graficos se simulen con datos realistas cuando no hay datos reales | Media | 2 dias |

### MODULO 5: Controles de Entrada

| ID | HU | Prioridad | Estimacion |
|---|---|---|---|
| **HU-52** | Como operador, quiero ver las teclas WASD en pantalla y que se iluminen al presionarlas | Media | 1 dia |
| **HU-53** | Como operador, quiero ver un volante virtual con botones dibujados en canvas | Media | 3 dias |
| **HU-54** | Como operador, quiero que el volante se mueva simulando la conduccion | Media | 1 dia |
| **HU-55** | Como operador, quiero ver un gamepad virtual con botones y joysticks | Media | 2 dias |
| **HU-56** | Como operador, quiero alternar entre teclado, volante y mando desde un submenu | Alta | 1 dia |
| **HU-57** | Como operador, quiero configurar las teclas/botones de cada control mediante un modal | Alta | 3 dias |
| **HU-58** | Como operador, quiero ver una imagen del control resaltando la accion que estoy configurando | Media | 2 dias |
| **HU-59** | Como operador, quiero restaurar los bindings por defecto de cada control | Baja | 0.5 dias |
| **HU-60** | Como operador, quiero que los bindings se guarden en localStorage | Media | 0.5 dias |
| **HU-61** | Como operador, quiero un freno de mano overlay que se active/desactive con click | Alta | 1 dia |

### MODULO 6: Layouts y Persistencia

| ID | HU | Prioridad | Estimacion |
|---|---|---|---|
| **HU-62** | Como operador, quiero guardar el layout actual (posicion de camaras + graficos + overlays) | Alta | 2 dias |
| **HU-63** | Como operador, quiero crear nuevos layouts con nombre personalizado | Alta | 1 dia |
| **HU-64** | Como operador, quiero listar todos los layouts guardados | Alta | 0.5 dias |
| **HU-65** | Como operador, quiero aplicar un layout guardado (restaurar camaras, graficos, posiciones) | Alta | 2 dias |
| **HU-66** | Como operador, quiero eliminar layouts guardados | Media | 0.5 dias |
| **HU-67** | Como operador, quiero que los layouts persistan en localStorage | Alta | 0.5 dias |
| **HU-68** | Como operador, quiero que el layout capture: visibilidad, orden, tamano, nombre personalizado de camaras | Alta | 1 dia |
| **HU-69** | Como operador, quiero que el layout capture: posicion, tamano y visibilidad de cada grafico overlay | Alta | 1 dia |

### MODULO 7: Modo Edicion

| ID | HU | Prioridad | Estimacion |
|---|---|---|---|
| **HU-70** | Como operador, quiero activar/desactivar un modo edicion con un boton (lock/unlock) | Alta | 1 dia |
| **HU-71** | Como operador, quiero que en modo edicion se puedan mover camaras y graficos | Alta | 1 dia |
| **HU-72** | Como operador, quiero que fuera del modo edicion los elementos esten bloqueados | Alta | 0.5 dias |
| **HU-73** | Como operador, quiero que los handles de resize solo sean visibles en modo edicion | Media | 0.5 dias |

### MODULO 8: Menus y Dropdowns

| ID | HU | Prioridad | Estimacion |
|---|---|---|---|
| **HU-74** | Como operador, quiero un menu de camaras con checkboxes para mostrar/ocultar | Alta | 1 dia |
| **HU-75** | Como operador, quiero un menu de ajustes con checkboxes para graficos y paneles | Alta | 1 dia |
| **HU-76** | Como operador, quiero submenus anidados (Controles, Aplicaciones) | Media | 1 dia |
| **HU-77** | Como operador, quiero un menu de layouts con botones de guardar y crear | Alta | 1 dia |
| **HU-78** | Como operador, quiero que los dropdowns se cierren al hacer click fuera o presionar Escape | Media | 0.5 dias |
| **HU-79** | Como operador, quiero tooltips en los botones del overlay | Baja | 0.5 dias |

### MODULO 9: Notificaciones y UX

| ID | HU | Prioridad | Estimacion |
|---|---|---|---|
| **HU-80** | Como operador, quiero recibir notificaciones toast al realizar acciones | Media | 1 dia |
| **HU-81** | Como operador, quiero que los botones tengan animaciones de hover y active | Baja | 1 dia |
| **HU-82** | Como operador, quiero que las transiciones de paneles sean suaves (300ms ease) | Baja | 0.5 dias |
| **HU-83** | Como operador, quiero que la interfaz use tema oscuro consistente | Alta | 2 dias |

### MODULO 10: Comunicacion con el Robot

| ID | HU | Prioridad | Estimacion |
|---|---|---|---|
| **HU-84** | Como operador, quiero probar la conexion al robot (GET /ping o /health) | Alta | 1 dia |
| **HU-85** | Como operador, quiero enviar comandos POST al robot (proximidad, pantalla, audio) | Alta | 2 dias |
| **HU-86** | Como operador, quiero actualizar la configuracion del robot (PUT /config) | Alta | 1 dia |
| **HU-87** | Como operador, quiero recibir datos en tiempo real via WebSocket | Alta | 3 dias |
| **HU-88** | Como operador, quiero que la comunicacion maneje errores y timeouts gracefully | Alta | 1 dia |

---

## 4. Resumen para Cronograma

| Modulo | HU Count | Estimacion Total | Prioridad |
|---|---|---|---|
| 1. Grid de Camaras | 10 | ~14.5 dias | Alta |
| 2. Panel de Conduccion | 19 | ~21 dias | Critica |
| 3. Sidebar Aplicaciones | 12 | ~11.5 dias | Alta |
| 4. Graficos Overlay | 10 | ~24 dias | Alta |
| 5. Controles de Entrada | 10 | ~15 dias | Media-Alta |
| 6. Layouts y Persistencia | 8 | ~9 dias | Alta |
| 7. Modo Edicion | 4 | ~3 dias | Alta |
| 8. Menus y Dropdowns | 6 | ~5.5 dias | Media |
| 9. Notificaciones y UX | 4 | ~4.5 dias | Baja-Media |
| 10. Comunicacion Robot | 5 | ~8 dias | Critica |
| **TOTAL** | **88 HU** | **~116 dias** | |

### Sprints Sugeridos (2 semanas cada uno)

| Sprint | Modulos | HU |
|---|---|---|
| Sprint 1 | Setup + Grid Camaras + Layout base | HU-01 a HU-10, HU-83 |
| Sprint 2 | Panel Conduccion (parte 1) + Menus | HU-11 a HU-20, HU-74 a HU-79 |
| Sprint 3 | Panel Conduccion (parte 2) + Comunicacion | HU-21 a HU-29, HU-84 a HU-88 |
| Sprint 4 | Sidebar + Graficos (parte 1) | HU-30 a HU-41, HU-42 a HU-44 |
| Sprint 5 | Graficos (parte 2) + Controles | HU-45 a HU-51, HU-52 a HU-56 |
| Sprint 6 | Controles config + Layouts + Modo Edicion | HU-57 a HU-73 |
| Sprint 7 | Persistencia + UX + Testing + Pulido | HU-62 a HU-69, HU-80 a HU-82 |

---

## 5. Notas Tecnicas

### Decisiones de Arquitectura
- **Zustand** sobre Redux: mas ligero, menos boilerplate, ideal para este tamano de proyecto
- **Canvas nativo** para graficos complejos (LiDAR, radar, velocimetro): mejor rendimiento que librerias SVG
- **Recharts** para grafico de packet loss: es un grafico de linea simple, no justifica canvas custom
- **@dnd-kit** para drag & drop: mas moderno y mantenible que react-beautiful-dnd
- **Componentes atomicos** en `ui/`: maximizar reutilizacion

### Patrones Recomendados
- **Compound components** para CameraTile (Header + Body + Footer)
- **Custom hooks** para logica de drag/resize/simulacion (separar de la UI)
- **Store por modulo** en Zustand (no un solo store gigante)
- **Barrel exports** en cada carpeta para imports limpios
- **Type-first**: definir interfaces en `types/` antes de implementar

### Consideraciones
- El HTML actual tiene **~2100 lineas de CSS** que se migraran a Tailwind + algunos estilos custom en `globals.css`
- El JavaScript tiene **~3300 lineas** que se distribuiran en componentes, hooks, stores y servicios
- Los **canvas drawings** (volante, LiDAR, radar, etc.) son complejos y requieren utilidades compartidas en `utils/canvas.ts`
- La funcionalidad de **pop-out windows** es compleja en React; considerar usar `createPortal` o iframes
