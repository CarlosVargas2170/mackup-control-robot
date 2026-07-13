# 🤖 Mackup Robot - Panel de Control HMI

Panel de control web (HMI) para robot mesero con visualización de cámaras, telemetría en tiempo real, control remoto y gestión de layouts personalizados.

---

## 📋 Índice

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Funcionalidades](#funcionalidades)
  - [Cámaras](#cámaras)
  - [Gráficos de Telemetría](#gráficos-de-telemetría)
  - [Layouts](#layouts)
  - [Sidebar Mesero Robot](#sidebar-mesero-robot)
  - [Controles](#controles)
- [API del Sidebar](#api-del-sidebar)
- [Personalización](#personalización)
- [Solución de Problemas](#solución-de-problemas)

---

## Descripción

Mackup Robot es un dashboard de control remoto diseñado para operar un robot mesero. Permite:

- Visualizar múltiples feeds de cámara en un grid flexible
- Monitorear telemetría en tiempo real (velocidad, packet loss)
- Controlar el robot mediante teclado, volante virtual o mando
- Gestionar layouts personalizados con posiciones, tamaños y visibilidad
- Interactuar con el API del robot (saludos, audio, configuración)

Todo en una única página HTML autocontenida con CSS y JavaScript inline.

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| **HTML5** | Estructura semántica, Canvas API |
| **CSS3** | Flexbox, Grid, Transiciones, Backdrop-filter |
| **Vanilla JavaScript** | Lógica de negocio, Eventos, Fetch API |
| **Font Awesome 6** | Iconografía |
| **localStorage** | Persistencia de layouts |

---

## Requisitos

- Navegador moderno con soporte para:
  - CSS `backdrop-filter`
  - CSS Custom Properties (`var()`)
  - HTML5 Drag & Drop API
  - Canvas 2D Context
- Servidor web local (recomendado para imágenes locales)
- **NO requiere** Node.js, build tools ni dependencias externas

---

## Instalación

1. Clonar o descargar el proyecto:
```bash
git clone <url-del-repo>
cd mackup_robot
```

2. El proyecto es un archivo HTML único. Para servirlo localmente:
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

### Configuración Inicial

1. Abrir el panel de **Configuración** (icono ⚙️ en la esquina superior derecha)
2. Activar/desactivar cámaras y gráficos según necesidad
3. Seleccionar tipo de control (Teclado / Volante / Mando)
4. (Opcional) Abrir sidebar **Mesero Robot** para configurar URL del API

---

## Ejecución

### Modo Desarrollo
```bash
# Servir con recarga automática (Live Server en VS Code recomendado)
# O simplemente abrir index.html directamente
```

### Modo Producción
- Copiar `index.html` y la carpeta `assets/` al servidor web
- Asegurar que las imágenes de cámaras y el mando estén accesibles

---

## Estructura del Proyecto

```
mackup_robot/
├── index.html              # Aplicación completa (HTML + CSS + JS)
├── assets/
│   └── imgs/
│       ├── mando_ofi.png   # Imagen del mando PSP
│       └── ...             # Otras imágenes de controles
└── README.md               # Este archivo
```

> **Nota**: Todo el código (HTML, CSS, JavaScript) está contenido en `index.html` para facilitar el despliegue sin build tools.

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
- Visual feedback con borde punteado azul durante el arrastre
- Soltar sobre otra cámara para intercambiar posiciones

#### Redimensionar
- **3 handles de resize** por cámara:
  - Esquina inferior-derecha (SE): ancho + alto
  - Borde inferior (S): solo alto
  - Borde derecho (E): solo ancho
- Mínimo: 140×110 píxeles
- Tamaños personalizados persisten entre layouts

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

Todos los gráficos son **arrastrables** y **redimensionables**:
- Arrastrar desde cualquier punto del gráfico
- Redimensionar desde esquina SE o bordes S/E
- Los gráficos circulares (acelerómetro, volante) mantienen aspecto 1:1

#### Acelerómetro (Velocímetro)
- **Visualización**: Gauge circular con aguja azul
- **Rango**: 0-120 km/h
- **Arco de fondo**: Gris semitransparente (sin color de progreso)
- **Número central**: Blanco semitransparente (75% opaco)
- **Posición inicial**: Centrado horizontal, top: 20px
- **Transparencia**: Fondo 85% transparente con blur

#### Packet Loss
- **Visualización**: Gráfico de línea con área bajo la curva
- **Datos**: Simulación de pérdida de paquetes (0-100%)
- **Colores**: Azul (normal), amarillo (>30%), rojo (>60%)
- **Posición inicial**: top: 80px, left: 20px
- **Transparencia**: Fondo semitransparente

#### Volante (Steering Wheel)
- **Visualización**: Volante circular con botones, dial y palancas
- **Interacción**: Simulación de rotación (-45° a 45°)
- **Transparencia**: Fondo 85% transparente con blur y borde sutil
- **Escalado**: Todos los elementos escalan proporcionalmente al redimensionar

#### Mando (Gamepad)
- **Visualización**: Imagen del mando (`assets/imgs/mando_ofi.png`)
- **Escalado**: Imagen con `object-fit: contain` para adaptarse al contenedor
- **Transparencia**: Fondo semitransparente

#### WASD (Teclado Virtual)
- **Visualización**: 4 teclas (W, A, S, D) en layout de cruz
- **Escalado**: Teclas escalan con variable CSS `--scale` basada en el ancho del contenedor
- **Feedback visual**: Teclas se iluminan en azul al presionar la tecla física correspondiente

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

### Los gráficos no aparecen al cargar
- Verificar que los checkboxes de "Aceleración" y "Packet loss" estén activados
- Los gráficos de control (volante/mando/WASD) dependen del radio button seleccionado

### El sidebar no conecta
- Verificar que la URL del robot incluya `http://` y el puerto correcto
- Comprobar que el robot esté en la misma red
- Revisar CORS en el servidor del robot

### Los layouts no se guardan
- Verificar que `localStorage` no esté deshabilitado en el navegador
- Limpiar `localStorage` si está corrupto: `localStorage.removeItem('camera_layouts')`

### El volante/mando no escala al redimensionar
- Recargar la página (los gráficos se redibujan automáticamente al resize)

---

## Licencia

Proyecto privado - Uso interno.

---

## Autor

Diseño para el proyecto **Control Robot**.

---

*Última actualización: Julio 2026*
