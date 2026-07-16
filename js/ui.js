// ═══════════════════════════════════════════════════════════
//  UI — Dropdowns, modo edición, settings checkboxes
// ═══════════════════════════════════════════════════════════

function initUI() {
    // ─── Dropdowns ───
    function closeAllDropdowns() {
        document.querySelectorAll('.dropdown-menu.open').forEach(m => m.classList.remove('open'));
        document.querySelectorAll('.submenu.open').forEach(s => s.classList.remove('open'));
        document.querySelectorAll('.chevron.open').forEach(c => c.classList.remove('open'));
    }

    const camToggle = document.querySelector('.btn-icon.cam');
    const camDropdown = document.getElementById('camerasMenu');
    if (camToggle && camDropdown) {
        camToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            document.getElementById('settingsMenu')?.classList.remove('open');
            document.getElementById('layoutsDropdown')?.classList.remove('open');
            camDropdown.classList.toggle('open');
            this.style.transform = 'scale(0.92)';
            setTimeout(() => { this.style.transform = ''; }, 150);
        });
    }

    const settingsToggle = document.querySelector('.dropdown-toggle');
    const settingsDropdown = document.getElementById('settingsMenu');
    if (settingsToggle && settingsDropdown) {
        settingsToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            camDropdown?.classList.remove('open');
            document.getElementById('layoutsDropdown')?.classList.remove('open');
            settingsDropdown.classList.toggle('open');
            this.style.transform = 'scale(0.92)';
            setTimeout(() => { this.style.transform = ''; }, 150);
        });
    }

    const layoutsToggle = document.getElementById('layoutsToggle');
    const layoutsDropdown = document.getElementById('layoutsDropdown');
    if (layoutsToggle && layoutsDropdown) {
        layoutsToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            camDropdown?.classList.remove('open');
            document.getElementById('settingsMenu')?.classList.remove('open');
            layoutsDropdown.classList.toggle('open');
            this.style.transform = 'scale(0.92)';
            setTimeout(() => { this.style.transform = ''; }, 150);
        });
    }

    // ─── Modo edición ───
    const editModeToggle = document.getElementById('editModeToggle');
    if (editModeToggle) {
        editModeToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            editMode = !editMode;
            if (editMode) {
                document.body.classList.add('edit-mode');
                this.classList.add('active');
                this.querySelector('i').className = 'fas fa-lock-open';
                this.title = 'Desactivar modo edición';
                showToast('Modo edición: los gráficos se pueden mover y redimensionar');
            } else {
                document.body.classList.remove('edit-mode');
                this.classList.remove('active');
                this.querySelector('i').className = 'fas fa-lock';
                this.title = 'Activar modo edición';
                showToast('Modo edición desactivado');
            }
        });
    }

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown-wrapper')) closeAllDropdowns();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeAllDropdowns();
    });
}

function initSettingsCheckboxes() {
    // ─── Aceleración ───
    const accelCheckbox = Array.from(settingsMenu.querySelectorAll('input[type="checkbox"]'))
        .find(cb => cb.closest('.dropdown-item')?.querySelector('.label-text')?.textContent === 'Aceleración');

    if (accelCheckbox) {
        accelCheckbox.addEventListener('change', function() {
            if (this.checked) {
                accelGraph.style.display = 'block';
                currentSpeed = 0;
                targetSpeed = 0;
                accelData = [0];
                accelInterval = setInterval(simulateAccel, 50);
                showToast('Velocímetro activado');
            } else {
                accelGraph.style.display = 'none';
                if (accelInterval) clearInterval(accelInterval);
                showToast('Velocímetro desactivado');
            }
        });
        if (accelCheckbox.checked) {
            accelGraph.style.display = 'block';
            currentSpeed = 0;
            targetSpeed = 0;
            accelData = [0];
            accelInterval = setInterval(simulateAccel, 50);
        }
    }

    // ─── GPS ───
    const gpsCheckbox = Array.from(settingsMenu.querySelectorAll('input[type="checkbox"]'))
        .find(cb => cb.closest('.dropdown-item')?.querySelector('.label-text')?.textContent === 'GPS');
    const gpsGraph = document.getElementById('gpsGraph');
    if (gpsCheckbox) {
        gpsCheckbox.addEventListener('change', function() {
            if (this.checked) {
                gpsGraph.style.display = 'block';
                gpsData = [{ x: 0, y: 0, heading: -Math.PI / 2 }];
                gpsInterval = setInterval(simulateGps, 100);
                drawGpsGraph();
                showToast('GPS activado');
            } else {
                gpsGraph.style.display = 'none';
                if (gpsInterval) clearInterval(gpsInterval);
                showToast('GPS desactivado');
            }
        });
    }

    // ─── Packet loss ───
    const packetLossCheckbox = Array.from(settingsMenu.querySelectorAll('input[type="checkbox"]'))
        .find(cb => cb.closest('.dropdown-item')?.querySelector('.label-text')?.textContent === 'Packet loss');

    if (packetLossCheckbox) {
        packetLossCheckbox.addEventListener('change', function() {
            if (this.checked) {
                packetLossGraph.style.display = 'block';
                packetLossData = [];
                packetLossInterval = setInterval(simulatePacketLoss, 100);
                showToast('Packet loss activado');
            } else {
                packetLossGraph.style.display = 'none';
                if (packetLossInterval) clearInterval(packetLossInterval);
                showToast('Packet loss desactivado');
            }
        });
        if (packetLossCheckbox.checked) {
            packetLossGraph.style.display = 'block';
            packetLossData = [];
            packetLossInterval = setInterval(simulatePacketLoss, 100);
        }
    }

    // ─── LiDAR ───
    const lidarCheckbox = Array.from(settingsMenu.querySelectorAll('input[type="checkbox"]'))
        .find(cb => cb.closest('.dropdown-item')?.querySelector('.label-text')?.textContent === 'LiDAR');

    if (lidarCheckbox) {
        lidarCheckbox.addEventListener('change', function() {
            if (this.checked) {
                lidarGraph.style.display = 'block';
                lidarSweepAngle = -Math.PI / 2;
                lidarObstacles = [];
                lidarInterval = setInterval(simulateLidar, 50);
                showToast('LiDAR activado');
            } else {
                lidarGraph.style.display = 'none';
                if (lidarInterval) clearInterval(lidarInterval);
                showToast('LiDAR desactivado');
            }
        });
        if (lidarCheckbox.checked) {
            lidarGraph.style.display = 'block';
            lidarSweepAngle = -Math.PI / 2;
            lidarObstacles = [];
            lidarInterval = setInterval(simulateLidar, 50);
        }
    }

    // ─── Radar frontal ───
    const radarFrontCheckbox = Array.from(settingsMenu.querySelectorAll('input[type="checkbox"]'))
        .find(cb => cb.closest('.dropdown-item')?.querySelector('.label-text')?.textContent === 'Radar frontal');

    if (radarFrontCheckbox) {
        radarFrontCheckbox.addEventListener('change', function() {
            if (this.checked) {
                radarFrontGraph.style.display = 'block';
                radarFrontValues = { FI: 0, FC: 0, FD: 0 };
                radarFrontInterval = setInterval(simulateRadarFront, 100);
                showToast('Radar frontal activado');
            } else {
                radarFrontGraph.style.display = 'none';
                if (radarFrontInterval) clearInterval(radarFrontInterval);
                showToast('Radar frontal desactivado');
            }
        });
        if (radarFrontCheckbox.checked) {
            radarFrontGraph.style.display = 'block';
            radarFrontValues = { FI: 0, FC: 0, FD: 0 };
            radarFrontInterval = setInterval(simulateRadarFront, 100);
        }
    }

    // ─── Fusión LIDAR + Radar ───
    const lidarFusionCheckbox = Array.from(settingsMenu.querySelectorAll('input[type="checkbox"]'))
        .find(cb => cb.closest('.dropdown-item')?.querySelector('.label-text')?.textContent === 'Fusión LIDAR+Radar');

    if (lidarFusionCheckbox) {
        lidarFusionCheckbox.addEventListener('change', function() {
            if (this.checked) {
                lidarFusionGraph.style.display = 'block';
                lidarSweepAngle = -Math.PI / 2;
                lidarObstacles = [];
                radarFrontValues = { FI: 0, FC: 0, FD: 0 };
                lidarFusionInterval = setInterval(simulateLidarFusion, 100);
                showToast('Fusión LIDAR+Radar activada');
            } else {
                lidarFusionGraph.style.display = 'none';
                if (lidarFusionInterval) clearInterval(lidarFusionInterval);
                showToast('Fusión LIDAR+Radar desactivada');
            }
        });
        if (lidarFusionCheckbox.checked) {
            lidarFusionGraph.style.display = 'block';
            lidarSweepAngle = -Math.PI / 2;
            lidarObstacles = [];
            radarFrontValues = { FI: 0, FC: 0, FD: 0 };
            lidarFusionInterval = setInterval(simulateLidarFusion, 100);
        }
    }

    // ─── Freno de mano ───
    const handbrakeCheckbox = Array.from(settingsMenu.querySelectorAll('input[type="checkbox"]'))
        .find(cb => cb.closest('.dropdown-item')?.querySelector('.label-text')?.textContent === 'Freno de mano');
    if (handbrakeCheckbox) {
        handbrakeCheckbox.addEventListener('change', function() {
            const overlay = document.getElementById('handbrakeOverlay');
            if (this.checked) {
                overlay.style.display = 'block';
                updateHandbrakeButton();
                initHandbrakeClick();
                showToast('Freno de mano visible');
            } else {
                overlay.style.display = 'none';
                if (handbrakeActive) toggleHandbrake();
                showToast('Freno de mano oculto');
            }
        });
    }

    // ─── Sidebar App ───
    const appsCheck = Array.from(settingsMenu.querySelectorAll('input[type="checkbox"]'))
        .find(cb => cb.name === 'appCheck' && cb.closest('.dropdown-item')?.textContent.includes('Mesero Robot'));

    if (appsCheck) {
        appsCheck.addEventListener('change', function() {
            if (this.checked) {
                appSidebar.classList.add('open');
                showToast('Mesero abierto');
            } else {
                appSidebar.classList.remove('open');
                showToast('Mesero cerrado');
            }
            setTimeout(recalcLayout, 350);
        });
    }
}
