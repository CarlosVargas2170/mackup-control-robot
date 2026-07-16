// ═══════════════════════════════════════════════════════════
//  GRÁFICOS — Drag & Resize de overlays
// ═══════════════════════════════════════════════════════════

function initGraphDragResize() {
    document.querySelectorAll('.graph-draggable').forEach(container => {
        if (container._graphDragInit) return;
        container._graphDragInit = true;
        const canvas = container.querySelector('canvas');

        container.addEventListener('mousedown', function(e) {
            if (!editMode) return;
            const rh = e.target.closest('.graph-resize');
            if (rh) {
                e.preventDefault();
                e.stopPropagation();
                const type = rh.dataset.resize;
                const padding = parseInt(getComputedStyle(container).paddingTop) || 10;
                const isC = container.classList.contains('accel-graph') ||
                           container.classList.contains('steering-wheel') ||
                           container.classList.contains('lidar-graph');
                graphResizeData = {
                    el: container, canvas: canvas, type: type,
                    startX: e.clientX, startY: e.clientY,
                    startW: container.offsetWidth, startH: container.offsetHeight,
                    minW: 100, minH: 100, padding: padding, isCircle: isC
                };
                return;
            }

            e.preventDefault();
            e.stopPropagation();
            const rect = container.getBoundingClientRect();
            const parent = container.parentElement;
            const parentRect = parent ? parent.getBoundingClientRect() : { left: 0, top: 0 };

            if (getComputedStyle(container).left === '50%') {
                container.style.left = (rect.left - parentRect.left) + 'px';
                container.style.top = (rect.top - parentRect.top) + 'px';
                container.style.transform = 'none';
            }

            container.classList.add('dragging');
            graphDragData = {
                el: container,
                startX: e.clientX, startY: e.clientY,
                startLeft: parseInt(container.style.left) || (rect.left - parentRect.left),
                startTop: parseInt(container.style.top) || (rect.top - parentRect.top)
            };
        });
    });

    document.addEventListener('mousemove', function(e) {
        if (graphDragData) {
            const dx = e.clientX - graphDragData.startX;
            const dy = e.clientY - graphDragData.startY;
            graphDragData.el.style.left = (graphDragData.startLeft + dx) + 'px';
            graphDragData.el.style.top  = Math.max(0, graphDragData.startTop + dy) + 'px';
        }

        if (graphResizeData) {
            const { el, canvas, type, startX, startY, startW, startH, minW, minH, padding, isCircle } = graphResizeData;
            let w = startW, h = startH;
            if (type === 'se' || type === 'e') w = Math.max(minW, startW + (e.clientX - startX));
            if (type === 'se' || type === 's') h = Math.max(minH, startH + (e.clientY - startY));
            if (isCircle && type === 'se') { const s = Math.max(w, h); w = h = s; }

            el.style.width = w + 'px';
            el.style.height = h + 'px';
            if (el.id === 'wasdKeys') el.style.setProperty('--scale', w / 160);
            if (canvas) {
                canvas.width  = Math.max(40, w - padding * 2);
                canvas.height = Math.max(40, h - padding * 2);
            }

            if (el.id === 'accelGraph') drawAccelGraph();
            else if (el.id === 'steeringWheel') drawSteeringWheel(0);
            else if (el.id === 'gamepadControl') drawGamepad();
            else if (el.id === 'packetLossGraph') drawPacketLossGraph();
            else if (el.id === 'lidarGraph') drawLidarGraph();
            else if (el.id === 'radarFrontGraph') drawRadarFrontGraph();
            else if (el.id === 'lidarFusionGraph') drawLidarFusionGraph();
            else if (el.id === 'handbrakeOverlay') updateHandbrakeButton();
            else if (el.id === 'gpsGraph') drawGpsGraph();
        }
    });

    document.addEventListener('mouseup', function() {
        if (graphDragData) {
            graphDragData.el.classList.remove('dragging');
            graphDragData = null;
        }
        if (graphResizeData) graphResizeData = null;
    });
}
