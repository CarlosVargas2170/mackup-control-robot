// ═══════════════════════════════════════════════════════════
//  FRENO DE MANO (Handbrake Overlay)
// ═══════════════════════════════════════════════════════════

function updateHandbrakeButton() {
    const btn = document.getElementById('handbrakeBtn');
    if (!btn) return;
    if (handbrakeActive) {
        btn.innerHTML = '\u26A0<br>FRENO<br>ACTIVO';
    } else {
        btn.innerHTML = 'FRENO<br>DE MANO';
    }
}

function toggleHandbrake() {
    const overlay = document.getElementById('handbrakeOverlay');
    handbrakeActive = !handbrakeActive;

    if (handbrakeActive) {
        overlay.classList.add('active-overlay');
        const dirSlider = document.getElementById('dpDirSlider');
        if (dirSlider) { dirSlider.value = 0; updateDrivingValue('dir', 0); }
        updateDrivingValue('acel', 0);
        updateDrivingValue('brake', 1000);
        const marchaEl = document.getElementById('dpMarchaReal');
        if (marchaEl) marchaEl.textContent = 'SAFE';
        showToast('FRENO DE MANO ACTIVADO');
    } else {
        overlay.classList.remove('active-overlay');
        updateDrivingValue('brake', 0);
        showToast('Freno de mano liberado');
    }
    updateHandbrakeButton();
}

function initHandbrakeClick() {
    const hb = document.getElementById('handbrakeOverlay');
    if (!hb || hb._hbInit) return;
    hb._hbInit = true;
    let hbDown = null;

    hb.addEventListener('mousedown', function(e) {
        if (e.target.closest('.graph-resize') || e.target.closest('.graph-drag-handle')) return;
        hbDown = { x: e.clientX, y: e.clientY };
    });

    hb.addEventListener('mouseup', function(e) {
        if (!hbDown) return;
        const dx = e.clientX - hbDown.x;
        const dy = e.clientY - hbDown.y;
        hbDown = null;
        if (Math.abs(dx) < 5 && Math.abs(dy) < 5) {
            toggleHandbrake();
        }
    });
}
