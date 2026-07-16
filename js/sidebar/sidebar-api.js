// ═══════════════════════════════════════════════════════════
//  SIDEBAR — API, conexión, audio, configuración, logger
// ═══════════════════════════════════════════════════════════

function testConnectionSB() {
    const url = document.getElementById('sbBaseUrl').value.trim();
    if (!url) return logSB('Ingresa una URL', 'err');
    logSB('Probando conexión a ' + url + '...', 'info');
    updateConnStatusSB('connecting');
    
    fetch(url + '/ping', { method: 'GET', mode: 'cors' })
        .then(r => {
            if (r.ok) {
                updateConnStatusSB('online');
                logSB('Conexión exitosa', 'ok');
            } else {
                throw new Error('Status ' + r.status);
            }
        })
        .catch(() => {
            fetch(url + '/health', { method: 'GET', mode: 'cors' })
                .then(r => {
                    if (r.ok) {
                        updateConnStatusSB('online');
                        logSB('Conexión exitosa (health)', 'ok');
                    } else {
                        throw new Error('Status ' + r.status);
                    }
                })
                .catch(() => {
                    updateConnStatusSB('offline');
                    logSB('No se pudo conectar a ' + url, 'err');
                });
        });
}

function updateConnStatusSB(status) {
    const dot = document.getElementById('sbConnDot');
    const text = document.getElementById('sbConnText');
    if (!dot || !text) return;
    dot.classList.remove('online');
    if (status === 'online') {
        dot.classList.add('online');
        text.textContent = 'Online';
    } else if (status === 'connecting') {
        text.textContent = 'Conectando...';
    } else {
        text.textContent = 'Offline';
    }
}

function callEndpointSB(method, path) {
    const url = document.getElementById('sbBaseUrl').value.trim();
    if (!url) return logSB('Configura la URL primero', 'err');
    const fullUrl = url + path;
    logSB(method + ' ' + path, 'info');
    
    fetch(fullUrl, { method: method, mode: 'cors' })
        .then(async r => {
            const txt = await r.text();
            if (r.ok) {
                logSB((txt || 'OK'), 'ok');
            } else {
                logSB(r.status + ' ' + txt, 'err');
            }
        })
        .catch(err => logSB('Error: ' + err.message, 'err'));
}

function playCustomAudioSB() {
    const url = document.getElementById('sbBaseUrl').value.trim();
    const asset = document.getElementById('sbCustomAsset').value.trim();
    const volume = document.getElementById('sbCustomVolume').value;
    const force = document.getElementById('sbCustomForce').checked;
    
    if (!url) return logSB('Configura la URL primero', 'err');
    if (!asset) return logSB('Ingresa ruta del audio', 'err');
    
    const params = new URLSearchParams();
    if (volume) params.set('volume', volume);
    if (force) params.set('force', 'true');
    
    const fullUrl = url + '/audio/play/' + asset + (params.toString() ? '?' + params : '');
    logSB('Reproduciendo: ' + asset, 'info');
    
    fetch(fullUrl, { method: 'POST', mode: 'cors' })
        .then(async r => {
            const txt = await r.text();
            if (r.ok) logSB('Audio OK', 'ok');
            else logSB('❌ ' + r.status + ' ' + txt, 'err');
        })
        .catch(err => logSB('Error: ' + err.message, 'err'));
}

function updateConfigSB() {
    const url = document.getElementById('sbBaseUrl').value.trim();
    if (!url) return logSB('Configura la URL primero', 'err');
    
    const body = {};
    const cfgUrl = document.getElementById('sbCfgBaseUrl').value.trim();
    const token = document.getElementById('sbCfgToken').value.trim();
    const merchant = document.getElementById('sbCfgMerchantId').value.trim();
    const product = document.getElementById('sbCfgProductId').value.trim();
    
    if (cfgUrl) body.base_url = cfgUrl;
    if (token) body.token = token;
    if (merchant) body.merchant_id = parseInt(merchant);
    if (product) body.product_id = parseInt(product);
    
    if (!Object.keys(body).length) return logSB('Sin cambios para guardar', 'err');
    
    logSB('Guardando configuración...', 'info');
    
    fetch(url + '/config', {
        method: 'PUT',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
        .then(async r => {
            const txt = await r.text();
            if (r.ok) logSB('Configuración guardada', 'ok');
            else logSB('❌ ' + r.status + ' ' + txt, 'err');
        })
        .catch(err => logSB('Error: ' + err.message, 'err'));
}

function logSB(msg, type) {
    const box = document.getElementById('sbLogBody');
    if (!box) return;
    const entry = document.createElement('div');
    entry.className = 'log-entry log-' + (type || 'info');
    const time = new Date().toLocaleTimeString();
    entry.textContent = '[' + time + '] ' + msg;
    box.appendChild(entry);
    box.scrollTop = box.scrollHeight;
}

function clearLogsSB() {
    const box = document.getElementById('sbLogBody');
    if (box) box.innerHTML = '<div class="log-entry log-info">Consola limpia</div>';
}
