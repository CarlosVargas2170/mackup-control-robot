// ═══════════════════════════════════════════════════════════
//  AUXILIARES — Toggle, press/release, micrófono, bocina
// ═══════════════════════════════════════════════════════════

function toggleAux(btn) {
    const aux = btn.dataset.aux;
    if (aux === 'abrir-puerta' || aux === 'cerrar-puerta') return;
    btn.classList.toggle('active');
    dpAuxState[aux] = btn.classList.contains('active');
    updateAuxStateText();
    const labels = {
        'luz-frontal': 'Luz frontal',
        'guinador-izq': 'Guiñador izquierdo',
        'guinador-der': 'Guiñador derecho',
        'balizas': 'Balizas',
        'destellador': 'Destellador'
    };
    showToast(`${labels[aux] || aux}: ${dpAuxState[aux] ? 'ON' : 'OFF'}`);
}

function toggleMic(btn) {
    btn.classList.toggle('active');
    micActive = btn.classList.contains('active');

    const dot = document.querySelector('#dpStatusMic .dp-status-dot');
    if (dot) {
        dot.classList.toggle('dot-on', micActive);
        dot.classList.toggle('dot-off', !micActive);
    }

    const val = document.querySelector('#dpStatusMic .dp-status-value');
    if (val) val.textContent = micActive ? 'Escuchando…' : 'Inactivo';

    dpAuxState['microfono'] = micActive;
    updateAuxStateText();

    showToast(`Micrófono: ${micActive ? 'ON' : 'OFF'}`);
}

function pressAux(btn) {
    btn.classList.add('pressed');
    const aux = btn.dataset.aux;
    dpAuxState[aux] = true;
    updateAuxStateText();
}

function releaseAux(btn) {
    btn.classList.remove('pressed');
    const aux = btn.dataset.aux;
    dpAuxState[aux] = false;
    updateAuxStateText();
}

function updateHornSound(val) {
    const labels = { normal: 'Bocina normal', suave: 'Bocina suave', aguda: 'Bocina aguda' };
    showToast(`Sonido: ${labels[val]}`);
}

function updateAuxStateText() {
    const el = document.getElementById('dpAuxState');
    if (!el) return;
    const state = (key) => dpAuxState[key] ? 'ON' : 'OFF';
    el.textContent = `Luz: ${state('luz-frontal')} · Destellador: ${state('destellador')} · Izq: ${state('guinador-izq')} · Der: ${state('guinador-der')} · Balizas: ${state('balizas')} · Mic: ${state('microfono')} · Puerta: ${state('cerrar-puerta') || state('abrir-puerta') ? 'ON' : 'OFF'}`;
}
