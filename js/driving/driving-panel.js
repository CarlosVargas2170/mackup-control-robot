// ═══════════════════════════════════════════════════════════
//  PANEL DE CONDUCCIÓN — Lógica principal
// ═══════════════════════════════════════════════════════════

function closeDrivingPanel() {
    const chk = document.getElementById('chkDrivingPanel');
    if (chk) {
        chk.checked = false;
        chk.dispatchEvent(new Event('change', { bubbles: true }));
    }
}

function setDrivingMode(mode) {
    dpModeState.current = mode;
    document.getElementById('dpBtnRC').classList.toggle('active', mode === 'RC');
    document.getElementById('dpBtnTELEOP').classList.toggle('active', mode === 'TELEOP');
    showToast(`Modo: ${mode}`);
}

function updateDrivingValue(type, val) {
    if (type === 'dir') {
        document.getElementById('dpDirValue').textContent = val;
        const slider = document.getElementById('dpDirSlider');
        const pct = ((parseFloat(val) + 1000) / 2000) * 100;
        slider.style.background = `linear-gradient(to right, #30363d 0%, #30363d ${pct}%, #58a6ff ${pct}%, #58a6ff 100%)`;
    } else if (type === 'acel') {
        const pct = Math.max(0, Math.min(100, (val / 1000) * 100));
        document.getElementById('dpAcelFill').style.width = pct + '%';
        document.getElementById('dpAcelValue').textContent = Math.round(pct) + '%';
        document.getElementById('dpAcelLabel').textContent = `${Math.round(val)} / 1000`;
    } else if (type === 'brake') {
        const pct = Math.max(0, Math.min(100, (val / 1000) * 100));
        document.getElementById('dpBrakeFill').style.width = pct + '%';
        document.getElementById('dpBrakeValue').textContent = Math.round(pct) + '%';
        document.getElementById('dpBrakeLabel').textContent = `${Math.round(val)} / 1000`;
    }
}

function updateMaxSpeed(val) {
    document.getElementById('dpMaxPct').textContent = val + '%';
}

function setDrivingGear(gear) {
    dpGearState.current = gear;
    document.getElementById('dpBtnRetro').classList.toggle('active', gear === 'retro');
    document.getElementById('dpBtnNeutral').classList.toggle('active', gear === 'neutral');
    document.getElementById('dpBtnAvance').classList.toggle('active', gear === 'avance');
    const labels = { retro: 'Retro (LB)', neutral: 'Neutral', avance: 'Avance (RB)' };
    showToast(`Marcha: ${labels[gear]}`);
}

function dpSimulate() {
    const dirSlider = document.getElementById('dpDirSlider');
    if (dirSlider) {
        const cur = parseInt(dirSlider.value) || 0;
        const target = Math.round((Math.random() - 0.5) * 1600);
        const next = Math.max(-1000, Math.min(1000, cur + (target - cur) * 0.1));
        dirSlider.value = next;
        updateDrivingValue('dir', next);
    }
    const acelVal = Math.round(Math.random() * 1000);
    const brakeVal = Math.round(700 + Math.random() * 300);
    updateDrivingValue('acel', acelVal);
    updateDrivingValue('brake', brakeVal);
    const axes = [];
    for (let i = 0; i < 8; i++) {
        const v = (Math.random() - 0.5) * 0.04;
        axes.push(`${i}:${v >= 0 ? '+' : ''}${v.toFixed(2)}`);
    }
    const axesEl = document.getElementById('dpAxes');
    if (axesEl) axesEl.textContent = axes.join(' · ') + ' · …';
    const btns = [];
    for (let i = 0; i < 4; i++) {
        btns.push(`${i}:${Math.random() < 0.05 ? '1.00' : '0.00'}`);
    }
    const btnsEl = document.getElementById('dpButtons');
    if (btnsEl) btnsEl.textContent = btns.join(' · ');
    const txEl = document.getElementById('dpUltimoTx');
    if (txEl) {
        const dirVal = dirSlider ? parseInt(dirSlider.value) : 0;
        txEl.textContent = `TELEOP ${dirVal} 0 ${Math.round(Math.random() * 1000)} 0 0`;
    }
    const marchaEl = document.getElementById('dpMarchaReal');
    if (marchaEl && !dpAuxState['_emergency']) {
        const m = Math.random();
        marchaEl.textContent = m < 0.6 ? 'SAFE' : (m < 0.9 ? 'RC' : 'TELEOP');
    }
    const tsEl = document.getElementById('dpTimestamp');
    if (tsEl) {
        const now = new Date();
        tsEl.textContent = now.toLocaleString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
}

function startDpSim() {
    if (dpSimInterval) return;
    dpSimInterval = setInterval(dpSimulate, 600);
}

function stopDpSim() {
    if (dpSimInterval) { clearInterval(dpSimInterval); dpSimInterval = null; }
}

function toggleMandoActivo() {
    dpMandoActivo = !dpMandoActivo;
    const btn = document.getElementById('dpBtnDesactivarMando');
    const stateEl = document.getElementById('dpMandoState');
    const warnEl = document.getElementById('dpWarningBlock');
    if (dpMandoActivo) {
        btn.textContent = 'Desactivar';
        btn.classList.remove('off');
        stateEl.textContent = 'Mando activo. Mantén esta pestaña abierta y visible.';
        stateEl.style.color = '';
        warnEl.style.display = 'none';
        showToast('Mando USB activado');
    } else {
        btn.textContent = 'Activar';
        btn.classList.add('off');
        stateEl.textContent = 'Mando desactivado. La conducción está bloqueada.';
        stateEl.style.color = 'rgba(210, 153, 34, 0.9)';
        warnEl.style.display = 'flex';
        showToast('Mando USB desactivado');
    }
}

function togglePowerSTM() {
    dpStmPowerOn = !dpStmPowerOn;
    const btn = document.getElementById('dpBtnPowerSTM');
    const modoEl = document.getElementById('dpModo');
    if (dpStmPowerOn) {
        btn.classList.remove('off');
        if (modoEl) modoEl.textContent = 'OFF';
        showToast('STM32 encendido');
    } else {
        btn.classList.add('off');
        if (modoEl) modoEl.textContent = 'OFFLINE';
        showToast('STM32 apagado');
    }
}

function triggerEmergencyStop() {
    const btn = document.getElementById('dpBtnEmergency');
    if (dpEmergencyActive) {
        dpEmergencyActive = false;
        btn.classList.remove('triggered');
        delete dpAuxState['_emergency'];
        showToast('Parada de emergencia liberada');
    } else {
        dpEmergencyActive = true;
        btn.classList.add('triggered');
        dpAuxState['_emergency'] = true;
        const dirSlider = document.getElementById('dpDirSlider');
        if (dirSlider) { dirSlider.value = 0; updateDrivingValue('dir', 0); }
        updateDrivingValue('acel', 0);
        updateDrivingValue('brake', 1000);
        const marchaEl = document.getElementById('dpMarchaReal');
        if (marchaEl) marchaEl.textContent = 'SAFE';
        showToast('PARADA DE EMERGENCIA ACTIVADA');
    }
}

function toggleDpCollapse(id, btn) {
    const el = document.getElementById(id);
    if (!el) return;
    const isOpen = el.classList.toggle('open');
    if (btn) btn.classList.toggle('open', isOpen);
}

function initDrivingPanel() {
    drivingPanel = document.getElementById('drivingPanel');

    if (settingsMenu) {
        const drivingCheck = document.getElementById('chkDrivingPanel')
            || Array.from(settingsMenu.querySelectorAll('input[type="checkbox"]'))
                .find(cb => cb.closest('.dropdown-item')?.querySelector('.label-text')?.textContent === 'Panel de conducción');

        if (drivingCheck) {
            drivingCheck.addEventListener('change', function() {
                if (this.checked) {
                    drivingPanel.classList.add('open');
                    showToast('Panel de conducción abierto');
                    document.getElementById('settingsMenu')?.classList.remove('open');
                } else {
                    drivingPanel.classList.remove('open');
                    showToast('Panel de conducción cerrado');
                }
                setTimeout(recalcLayout, 350);
            });
            if (drivingCheck.checked) {
                drivingPanel.classList.add('open');
            }
        }
    }

    if (drivingPanel) {
        const observer = new MutationObserver(() => {
            if (drivingPanel.classList.contains('open')) startDpSim();
            else stopDpSim();
        });
        observer.observe(drivingPanel, { attributes: true, attributeFilter: ['class'] });
        if (drivingPanel.classList.contains('open')) startDpSim();
    }
}
