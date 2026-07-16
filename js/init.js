// ═══════════════════════════════════════════════════════════
//  INICIALIZACIÓN — Punto de entrada principal
// ═══════════════════════════════════════════════════════════

(function() {
    'use strict';

    // ─── Inicializar referencias DOM ───
    function initDOMReferences() {
        grid = document.getElementById('cameraGrid');
        camerasMenu = document.getElementById('camerasMenu');
        settingsMenu = document.getElementById('settingsMenu');
        appSidebar = document.getElementById('appSidebar');
        drivingPanel = document.getElementById('drivingPanel');
        ctrlModal = document.getElementById('ctrlModal');
        ctrlModalBox = document.getElementById('ctrlModalBox');

        wasdKeys = document.getElementById('wasdKeys');
        steeringWheel = document.getElementById('steeringWheel');
        gamepadControl = document.getElementById('gamepadControl');

        steeringCanvas = document.getElementById('steeringCanvas');
        steeringCtx = steeringCanvas?.getContext('2d');
        gamepadCanvas = document.getElementById('gamepadCanvas');
        gamepadCtx = gamepadCanvas?.getContext('2d');

        accelCanvas = document.getElementById('accelCanvas');
        accelCtx = accelCanvas?.getContext('2d');
        packetLossCanvas = document.getElementById('packetLossCanvas');
        packetLossCtx = packetLossCanvas?.getContext('2d');
        lidarCanvas = document.getElementById('lidarCanvas');
        lidarCtx = lidarCanvas?.getContext('2d');
        radarFrontCanvas = document.getElementById('radarFrontCanvas');
        radarFrontCtx = radarFrontCanvas?.getContext('2d');
        lidarFusionCanvas = document.getElementById('lidarFusionCanvas');
        lidarFusionCtx = lidarFusionCanvas?.getContext('2d');
        gpsCanvas = document.getElementById('gpsCanvas');
        gpsCtx = gpsCanvas?.getContext('2d');

        accelGraph = document.getElementById('accelGraph');
        packetLossGraph = document.getElementById('packetLossGraph');
        lidarGraph = document.getElementById('lidarGraph');
        radarFrontGraph = document.getElementById('radarFrontGraph');
        lidarFusionGraph = document.getElementById('lidarFusionGraph');
    }

    // ─── Inicializar todo ───
    function init() {
        initDOMReferences();

        // ─── Cámaras ───
        initCameras();

        // ─── Overlays ───
        initGraphDragResize();
        initWasdKeys();

        // ─── Controles ───
        initControls();

        // ─── Layouts ───
        initLayouts();

        // ─── Driving Panel ───
        initDrivingPanel();

        // ─── UI ───
        initUI();
        initSettingsCheckboxes();

        // ─── Layout inicial ───
        recalcLayout();

        // ─── Toast de bienvenida ───
        setTimeout(() => showToast('Arrastra cámaras · bordes para redimensionar'), 500);
    }

    // ─── Esperar DOM ready ───
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
