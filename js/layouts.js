// ═══════════════════════════════════════════════════════════
//  LAYOUTS — Guardar, cargar, aplicar, persistencia
// ═══════════════════════════════════════════════════════════

function captureState() {
    const tiles = grid.querySelectorAll('.cam-tile');
    const cameras = [];
    tiles.forEach(t => {
        cameras.push({
            id: t.dataset.camId,
            width: t.style.width,
            height: t.style.height,
            order: Array.from(grid.children).indexOf(t),
            hidden: t.classList.contains('hidden'),
            customWidth: t.dataset.customWidth || null,
            customHeight: t.dataset.customHeight || null,
            customName: t.dataset.customName || null
        });
    });
    const graphs = {};
    if (settingsMenu) {
        const checkboxes = settingsMenu.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            const label = cb.closest('.dropdown-item')?.querySelector('.label-text');
            if (label) {
                const name = label.textContent.trim();
                if (name === 'Aceleración' || name === 'Packet loss') {
                    graphs[name] = cb.checked;
                }
            }
        });
    }
    const graphElements = {};
    const graphIds = ['accelGraph','packetLossGraph','lidarGraph','radarFrontGraph','lidarFusionGraph','steeringWheel','gamepadControl','wasdKeys','handbrakeOverlay','gpsGraph'];
    graphIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            graphElements[id] = {
                visible: el.style.display !== 'none',
                top: el.style.top || '',
                left: el.style.left || '',
                transform: el.style.transform || '',
                width: el.style.width || '',
                height: el.style.height || ''
            };
        }
    });
    return { cameras, graphs, graphElements };
}

function applyState(state) {
    const cameras = Array.isArray(state) ? state : (state.cameras || []);
    const graphs = Array.isArray(state) ? {} : (state.graphs || {});
    const graphElements = Array.isArray(state) ? {} : (state.graphElements || {});

    cameras.sort((a, b) => a.order - b.order);
    const visible = [];
    cameras.forEach(c => {
        const t = grid.querySelector(`.cam-tile[data-cam-id="${c.id}"]`);
        if (!t) return;
        if (c.hidden) t.classList.add('hidden');
        else { t.classList.remove('hidden'); visible.push(t); }
        if (c.customWidth) { t.style.width = c.customWidth; t.dataset.customWidth = c.customWidth; }
        else { t.style.width = c.width; delete t.dataset.customWidth; }
        if (c.customHeight) { t.style.height = c.customHeight; t.dataset.customHeight = c.customHeight; }
        else { t.style.height = c.height; delete t.dataset.customHeight; }
        const nameEl = t.querySelector('.cam-header .name');
        if (nameEl) {
            const iconHTML = nameEl.querySelector('i')?.outerHTML || '';
            if (c.customName) {
                nameEl.innerHTML = iconHTML + ' ' + c.customName;
                t.dataset.customName = c.customName;
            } else {
                const original = t.dataset.originalName || t.dataset.camId.toUpperCase();
                nameEl.innerHTML = iconHTML + ' ' + original;
                delete t.dataset.customName;
            }
        }
        grid.appendChild(t);
    });
    visible.forEach(t => {
        if (!t.dataset.customWidth) t.dataset.customWidth = t.style.width;
        if (!t.dataset.customHeight) t.dataset.customHeight = t.style.height;
    });

    applyGraphState(graphs);
    applyGraphElements(graphElements);
}

function applyGraphState(graphs) {
    if (!settingsMenu || !Object.keys(graphs).length) return;

    const checkboxes = settingsMenu.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
        const label = cb.closest('.dropdown-item')?.querySelector('.label-text');
        if (!label) return;
        const name = label.textContent.trim();
        if (graphs.hasOwnProperty(name) && cb.checked !== graphs[name]) {
            cb.checked = graphs[name];
            cb.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
}

function applyGraphElements(graphElements) {
    if (!Object.keys(graphElements).length) return;
    Object.keys(graphElements).forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const s = graphElements[id];
        if (s.visible) {
            el.style.display = 'block';
        } else {
            el.style.display = 'none';
        }
        if (s.top) el.style.top = s.top;
        if (s.left) el.style.left = s.left;
        if (s.transform) el.style.transform = s.transform;
        if (s.width) {
            el.style.width = s.width;
            el.style.height = s.height || '';
            if (id === 'wasdKeys') el.style.setProperty('--scale', parseInt(s.width) / 160);
            const canvas = el.querySelector('canvas');
            if (canvas) {
                const w = parseInt(s.width) || 200;
                const h = parseInt(s.height) || 200;
                const padding = parseInt(getComputedStyle(el).paddingTop) || 10;
                canvas.width  = Math.max(40, w - padding * 2);
                canvas.height = Math.max(40, h - padding * 2);
            }
        }
        if (id === 'accelGraph' && el.style.display !== 'none') drawAccelGraph();
        else if (id === 'packetLossGraph' && el.style.display !== 'none') drawPacketLossGraph();
        else if (id === 'steeringWheel' && el.style.display !== 'none') drawSteeringWheel(0);
        else if (id === 'gamepadControl' && el.style.display !== 'none') drawGamepad();
        else if (id === 'lidarGraph' && el.style.display !== 'none') drawLidarGraph();
        else if (id === 'radarFrontGraph' && el.style.display !== 'none') drawRadarFrontGraph();
        else if (id === 'lidarFusionGraph' && el.style.display !== 'none') drawLidarFusionGraph();
        else if (id === 'handbrakeOverlay' && el.style.display !== 'none') updateHandbrakeButton();
        else if (id === 'gpsGraph' && el.style.display !== 'none') drawGpsGraph();
    });
}

function loadLayouts() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
}

function saveLayouts(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function renderLayoutList() {   
    const sub = document.getElementById('layoutsList');
    if (!sub) return;
    const layouts = loadLayouts();
    const names = Object.keys(layouts);
    sub.innerHTML = '';

    if (names.length === 0) {
        sub.innerHTML = '<div class="dropdown-item" style="font-size:11px;color:#555;cursor:default;padding:4px 16px;">(sin layouts guardados)</div>';
        activeLayoutName = null;
        return;
    }

    names.forEach(name => {
        const div = document.createElement('div');
        div.className = 'layout-item' + (name === activeLayoutName ? ' active' : '');
        div.innerHTML = `<span class="layout-dot"></span><span class="layout-name">${name}</span><span class="layout-del" title="Eliminar">🗑</span>`;

        div.querySelector('.layout-name').addEventListener('click', (e) => {
            e.stopPropagation();
            activeLayoutName = name;
            const data = loadLayouts();
            if (data[name]) applyState(data[name]);
            renderLayoutList();
            showToast('Layout "' + name + '" aplicado');
        });

        div.querySelector('.layout-del').addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('¿Eliminar layout "' + name + '"?')) {
                const data = loadLayouts();
                delete data[name];
                saveLayouts(data);
                if (activeLayoutName === name) activeLayoutName = null;
                renderLayoutList();
                showToast('Layout eliminado');
            }
        });

        sub.appendChild(div);
    });
}

function saveCurrentLayout() {
    if (!activeLayoutName) {
        const name = prompt('Nombre del layout:');
        if (!name || !name.trim()) return;
        activeLayoutName = name.trim();
    }
    const data = loadLayouts();
    data[activeLayoutName] = captureState();
    saveLayouts(data);
    renderLayoutList();
    showToast('Layout "' + activeLayoutName + '" guardado');
}

function createNewLayout() {
    const name = prompt('Nombre del nuevo layout:');
    if (!name || !name.trim()) return;
    activeLayoutName = name.trim();
    const data = loadLayouts();
    data[activeLayoutName] = captureState();
    saveLayouts(data);
    renderLayoutList();
    showToast('Layout "' + activeLayoutName + '" creado');
}

function initLayouts() {
    const saveLayoutBtn = document.getElementById('saveLayoutBtn');
    const createLayoutBtn = document.getElementById('createLayoutBtn');

    if (saveLayoutBtn) {
        saveLayoutBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.style.transform = 'scale(0.92)';
            setTimeout(() => { this.style.transform = ''; }, 150);
            saveCurrentLayout();
        });
    }

    if (createLayoutBtn) {
        createLayoutBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.style.transform = 'scale(0.92)';
            setTimeout(() => { this.style.transform = ''; }, 150);
            createNewLayout();
        });
    }

    renderLayoutList();
}
