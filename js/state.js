// ═══════════════════════════════════════════════════════════
//  ESTADO COMPARTIDO — Variables globales de la aplicación
// ═══════════════════════════════════════════════════════════

// ─── DOM references ───
var grid = null;
var camerasMenu = null;
var settingsMenu = null;
var appSidebar = null;
var drivingPanel = null;
var ctrlModal = null;
var ctrlModalBox = null;

// ─── Camera elements ───
var wasdKeys = null;
var steeringWheel = null;
var gamepadControl = null;

// ─── Canvas references ───
var steeringCanvas = null;
var steeringCtx = null;
var gamepadCanvas = null;
var gamepadCtx = null;
var accelCanvas = null;
var accelCtx = null;
var packetLossCanvas = null;
var packetLossCtx = null;
var lidarCanvas = null;
var lidarCtx = null;
var radarFrontCanvas = null;
var radarFrontCtx = null;
var lidarFusionCanvas = null;
var lidarFusionCtx = null;
var gpsCanvas = null;
var gpsCtx = null;

// ─── Graph container references ───
var accelGraph = null;
var packetLossGraph = null;
var lidarGraph = null;
var radarFrontGraph = null;
var lidarFusionGraph = null;

// ─── Drag & Drop state ───
var draggedEl = null;
var dragDownTarget = null;
var resizeData = null;

// ─── Graph drag & resize state ───
var graphDragData = null;
var graphResizeData = null;
var editMode = false;

// ─── Graph data ───
var accelData = [];
var packetLossData = [];
var lidarObstacles = [];
var radarFrontValues = { FI: 0, FC: 0, FD: 0 };
var maxDataPoints = 100;
var gpsData = [];
var lidarSweepAngle = -Math.PI / 2;

// ─── Simulation intervals ───
var accelInterval = null;
var packetLossInterval = null;
var lidarInterval = null;
var radarFrontInterval = null;
var lidarFusionInterval = null;
var gpsInterval = null;

// ─── Speed simulation ───
var currentSpeed = 0;
var targetSpeed = 0;

// ─── Steering simulation ───
var steeringAngle = 0;
var steeringTarget = 0;
var steeringInterval = null;

// ─── Layouts ───
var STORAGE_KEY = 'camera_layouts';
var activeLayoutName = null;

// ─── Driving panel state ───
var dpAuxState = {};
var dpGearState = { current: 'neutral' };
var dpModeState = { current: 'RC' };
var dpSimInterval = null;
var micActive = false;

// ─── STM32 / Mando state ───
var dpMandoActivo = true;
var dpStmPowerOn = true;
var dpEmergencyActive = false;
var handbrakeActive = false;

// ─── Popout state ───
var sidebarPopout = null;
var sidebarPollInterval = null;
var drivingPopout = null;
var drivingPopoutPollInterval = null;

// ─── Toast ───
var toastTimeout = null;

// ─── Fusion constants ───
var FUSION_MAX_CM = 300;
var FUSION_CM_TO_RADIUS = 0.85 / FUSION_MAX_CM;

// ─── Control bindings ───
var ALL_ACTIONS = [
    { id:'forward', label:'Acelerar / Adelante' },
    { id:'backward', label:'Frenar / Atrás' },
    { id:'left', label:'Girar izquierda' },
    { id:'right', label:'Girar derecha' },
    { id:'stop', label:'Detener' },
    { id:'boost', label:'Turbo / Boost' },
    { id:'horn', label:'Bocina' },
    { id:'light', label:'Luces' },
];

var defaultBindings = {
    teclado: {
        forward:'W', backward:'S', left:'A', right:'D',
        stop:'Space', boost:'Shift', horn:'H', light:'L'
    },
    volante: {
        forward:'RT (acelerador)', backward:'LT (freno)',
        left:'Volante ←', right:'Volante →',
        stop:'Botón A (negro sup)', boost:'Botón Y (amarillo)',
        horn:'Botón B (azul)', light:'Botón L (negro inf)'
    },
    mando: {
        forward:'RT', backward:'LT',
        left:'Joystick izq ←', right:'Joystick izq →',
        stop:'A', boost:'Y',
        horn:'B', light:'X'
    }
};

var actionPositions = {
    teclado: {
        forward:{x:170,y:30,w:32,h:32}, backward:{x:170,y:68,w:32,h:32},
        left:{x:132,y:68,w:32,h:32}, right:{x:208,y:68,w:32,h:32},
        stop:{x:120,y:105,w:130,h:25}, boost:{x:10,y:30,w:45,h:32}, horn:{x:260,y:30,w:32,h:32}, light:{x:298,y:30,w:32,h:32}
    },
    volante: {
        forward:{x:290,y:55,r:9}, backward:{x:50,y:55,r:9},
        left:{x:20,y:10,w:40,h:20}, right:{x:320,y:10,w:40,h:20},
        stop:{x:290,y:85,r:7}, horn:{x:103,y:65,r:7}, light:{x:175,y:62,r:7}
    },
    mando: {
        forward:{x:205,y:22,w:30,h:8}, backward:{x:80,y:22,w:30,h:8},
        left:{x:90,y:67,r:18}, right:{x:220,y:67,r:18},
        stop:{x:245,y:80,r:10}, boost:{x:245,y:40,r:10},
        horn:{x:262,y:60,r:10}, light:{x:228,y:60,r:10}
    }
};
