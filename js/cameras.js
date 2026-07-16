// ═══════════════════════════════════════════════════════════
//  CÁMARAS — Grid, drag & drop, resize, nombres, popout
// ═══════════════════════════════════════════════════════════

function initCameras() {
    grid = document.getElementById('cameraGrid');
    if (!grid) return;

    grid.querySelectorAll('.cam-tile').forEach(t => t.setAttribute('draggable', 'true'));

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.matches && node.matches('.cam-tile')) {
                    node.setAttribute('draggable', 'true');
                }
            });
        });
    });
    observer.observe(grid, { childList: true });

    grid.querySelectorAll('.cam-tile').forEach(injectPopout);

    const popoutObserver = new MutationObserver(function(mutations) {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.matches && node.matches('.cam-tile')) {
                    injectPopout(node);
                }
            });
        });
    });
    popoutObserver.observe(grid, { childList: true });

    grid.querySelectorAll('.cam-tile').forEach(setupNameEditing);

    const nameObserver = new MutationObserver(function(mutations) {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.matches && node.matches('.cam-tile')) {
                    setupNameEditing(node);
                }
            });
        });
    });
    nameObserver.observe(grid, { childList: true });

    // ─── Drag & Drop ───
    grid.addEventListener('mousedown', function(e) {
        dragDownTarget = e.target;
    }, true);

    grid.addEventListener('dragstart', function(e) {
        if (!editMode) { e.preventDefault(); return; }
        if (dragDownTarget && dragDownTarget.closest('.resize-handle')) {
            e.preventDefault();
            dragDownTarget = null;
            return;
        }
        const tile = e.target.closest('.cam-tile');
        if (!tile) return;
        draggedEl = tile;
        tile.classList.add('dragging');
        e.dataTransfer.setData('text/plain', tile.dataset.camId);
        e.dataTransfer.effectAllowed = 'move';
        dragDownTarget = null;
    });

    grid.addEventListener('dragend', function(e) {
        if (draggedEl) {
            draggedEl.classList.remove('dragging');
            draggedEl = null;
        }
        grid.querySelectorAll('.cam-tile.drag-over').forEach(t => t.classList.remove('drag-over'));
    });

    grid.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });

    grid.addEventListener('dragenter', function(e) {
        e.preventDefault();
        const target = e.target.closest('.cam-tile');
        if (target && target !== draggedEl) {
            target.classList.add('drag-over');
        }
    });

    grid.addEventListener('dragleave', function(e) {
        const target = e.target.closest('.cam-tile');
        if (target) target.classList.remove('drag-over');
    });

    grid.addEventListener('drop', function(e) {
        e.preventDefault();
        const target = e.target.closest('.cam-tile');
        if (!target || !draggedEl) return;
        target.classList.remove('drag-over');

        const draggedId = e.dataTransfer.getData('text/plain');
        if (!draggedId || target.dataset.camId === draggedId) return;

        const fromIndex = Array.from(grid.children).indexOf(draggedEl);
        const toIndex = Array.from(grid.children).indexOf(target);

        if (fromIndex < toIndex) {
            grid.insertBefore(draggedEl, target.nextElementSibling);
        } else {
            grid.insertBefore(draggedEl, target);
        }
        recalcLayout();
        showToast(`${draggedId} movida`);
    });

    // ─── Resize ───
    grid.addEventListener('mousedown', function(e) {
        if (!editMode) return;
        const handle = e.target.closest('.resize-handle');
        if (!handle) return;
        e.preventDefault();
        e.stopPropagation();
        const tile = handle.closest('.cam-tile');
        const type = handle.dataset.resize;
        const startX = e.clientX;
        const startY = e.clientY;
        const startW = tile.offsetWidth;
        const startH = tile.offsetHeight;
        resizeData = { tile, type, startX, startY, startW, startH, camId: tile.dataset.camId };
    });

    document.addEventListener('mousemove', function(e) {
        if (!resizeData) return;
        const { tile, type, startX, startY, startW, startH } = resizeData;
        let w = startW, h = startH;
        if (type === 'se' || type === 'e') w = Math.max(140, startW + (e.clientX - startX));
        if (type === 'se' || type === 's') h = Math.max(110, startH + (e.clientY - startY));
        tile.style.width = w + 'px';
        tile.style.height = h + 'px';
    });

    document.addEventListener('mouseup', function() {
        if (resizeData) {
            showToast(`${resizeData.camId} redimensionada`);
            resizeData = null;
        }
    });

    // ─── Checkbox visibilidad ───
    if (camerasMenu) {
        camerasMenu.addEventListener('change', function(e) {
            const cb = e.target.closest('input[type="checkbox"]');
            if (!cb) return;
            const label = cb.closest('.dropdown-item');
            const camName = label?.querySelector('.label-text')?.textContent.trim();
            if (!camName) return;

            let tile = null;
            grid.querySelectorAll('.cam-tile').forEach(t => {
                const nameEl = t.querySelector('.cam-header .name');
                if (nameEl && nameEl.textContent.trim().includes(camName)) {
                    tile = t;
                }
            });

            if (tile) {
                if (cb.checked) {
                    tile.classList.remove('hidden');
                    showToast(camName + ' visible');
                } else {
                    tile.classList.add('hidden');
                    delete tile.dataset.customWidth;
                    delete tile.dataset.customHeight;
                    showToast(camName + ' oculta');
                }
                recalcLayout();
            }
        });
    }
}

// ─── Popout injection ───
function injectPopout(tile) {
    if (tile.querySelector('.cam-popout')) return;
    const body = tile.querySelector('.cam-body');
    if (!body) return;
    const btn = document.createElement('button');
    btn.className = 'cam-popout';
    btn.title = 'Abrir en nueva pestaña';
    btn.innerHTML = '<i class="fas fa-external-link-alt"></i>';
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const img = body.querySelector('img');
        const src = img?.src;
        if (src) window.open(src, '_blank');
    });
    body.appendChild(btn);
}

// ─── Name editing ───
function setupNameEditing(tile) {
    const nameEl = tile.querySelector('.cam-header .name');
    if (!nameEl || nameEl._nameEditSetup) return;
    nameEl._nameEditSetup = true;
    if (!tile.dataset.originalName) {
        tile.dataset.originalName = nameEl.textContent.trim();
    }
    nameEl.style.cursor = 'text';
    nameEl.title = 'Doble click para renombrar';

    nameEl.addEventListener('dblclick', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (nameEl.querySelector('.cam-name-input')) return;

        const iconHTML = nameEl.querySelector('i')?.outerHTML || '';
        const currentText = nameEl.textContent.trim();

        nameEl.innerHTML = iconHTML + ' ';
        const input = document.createElement('input');
        input.className = 'cam-name-input';
        input.value = currentText;
        input.style.cssText = 'background:#0d1117;border:1px solid #58a6ff;color:#f0f6fc;' +
            'font-size:12px;font-weight:600;padding:0 4px;border-radius:3px;width:100px;outline:none;';
        nameEl.appendChild(input);
        input.focus();
        input.select();

        function save() {
            const newName = input.value.trim() || currentText;
            nameEl.innerHTML = iconHTML + ' ' + newName;
            tile.dataset.customName = newName;
            showToast(tile.dataset.camId + ' → ' + newName);
        }

        input.addEventListener('blur', save);
        input.addEventListener('keydown', function(ev) {
            if (ev.key === 'Enter') { ev.preventDefault(); input.blur(); }
            if (ev.key === 'Escape') {
                ev.preventDefault();
                nameEl.innerHTML = iconHTML + ' ' + currentText;
            }
        });
    });
}

// ─── Layout dinámico ───
function recalcLayout() {
    if (!grid) return;
    const visible = Array.from(grid.querySelectorAll('.cam-tile:not(.hidden)'));
    const count = visible.length;
    if (count === 0) return;

    let w, h;
    if (count === 1) {
        w = 'calc(100% - 0px)'; h = 'calc(96% - 0px)';
    } else if (count === 2) {
        w = 'calc(50% - 5px)';  h = 'calc(96% - 0px)';
    } else if (count <= 4) {
        w = 'calc(50% - 5px)';  h = 'calc(48% - 0px)';
    } else if (count <= 6) {
        w = 'calc(33.33% - 7px)'; h = 'calc(32% - 0px)';
    } else {
        w = 'calc(25% - 8px)';  h = 'calc(24% - 0px)';
    }

    visible.forEach(tile => {
        if (!tile.dataset.customWidth) {
            tile.style.width = w;
            tile.style.height = h;
        }
    });
}
