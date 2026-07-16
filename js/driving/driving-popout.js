// ═══════════════════════════════════════════════════════════
//  POP-OUT PANEL DE CONDUCCIÓN (RD2 Teleop)
// ═══════════════════════════════════════════════════════════

function popoutDrivingPanel() {
    const panel = document.getElementById('drivingPanel');
    if (!panel) return;

    if (drivingPopout && !drivingPopout.closed) {
        drivingPopout.close();
        return;
    }

    const inner = panel.querySelector('.dp-inner');
    if (!inner) return;

    const html = inner.innerHTML.replace(
        'id="dpPopoutBtn" onclick="popoutDrivingPanel()"',
        'onclick="window.close()"'
    ).replace(
        'Abrir en ventana independiente',
        'Cerrar y regresar'
    );

    const finalHtml = html.replace(
        'onclick="closeDrivingPanel()"',
        'onclick="window.close()"'
    );

    const styleEl = document.querySelector('style');
    const styles = styleEl ? styleEl.innerHTML : '';
    const scripts = document.querySelectorAll('script');
    let dpScript = '';
    for (let i = scripts.length - 1; i >= 0; i--) {
        const sc = scripts[i].innerHTML;
        if (sc.includes('setDrivingMode') || sc.includes('updateDrivingValue')) {
            dpScript = sc;
            break;
        }
    }

    drivingPopout = window.open('', 'RD2Teleop', 'width=760,height=920');

    drivingPopout.document.write('<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">' +
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
        '<title>RD2 Teleop - Panel de Conducción</title>' +
        '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">' +
        '<style>');
    drivingPopout.document.write(styles);
    drivingPopout.document.write('</style><style>' +
        'html,body{margin:0;padding:0;overflow-x:hidden;height:100vh;background:#0a0e14;' +
        'font-family:"Segoe UI",system-ui,sans-serif;color:#c9d1d9;}' +
        '.driving-panel{position:fixed!important;top:0!important;right:0!important;left:0!important;' +
        'width:100%!important;height:100vh!important;max-width:none!important;' +
        'transform:translateX(0)!important;border-left:none!important;border-radius:0!important;' +
        'overflow-y:auto!important;overflow-x:hidden!important;flex-shrink:unset!important;}' +
        '.driving-panel.open{width:100%!important;max-width:none!important;}' +
        '.dp-inner{width:100%!important;max-width:none!important;margin:0!important;' +
        'padding:16px 16px 24px!important;height:auto!important;min-height:100vh;' +
        'overflow-y:visible!important;box-sizing:border-box!important;display:flex!important;' +
        'flex-direction:column!important;gap:14px!important;}' +
        '@media(min-width:600px){' +
        '.dp-inner{padding:22px 28px 30px!important;gap:18px!important;}' +
        '.dp-status-item{min-width:150px;font-size:13px;padding:10px 14px;}' +
        '.dp-throttle-row{gap:16px;}' +
        '.dp-section{padding:16px 20px;}' +
        '.dp-aux-grid{grid-template-columns:1fr 1fr 1fr!important;gap:8px;}' +
        '.dp-gear-buttons{gap:8px;}' +
        '}' +
        '@media(min-width:900px){' +
        '.dp-inner{padding:28px 44px 36px!important;gap:20px!important;}' +
        '.dp-status{gap:12px;}' +
        '.dp-status-item{min-width:170px;font-size:14px;padding:12px 18px;}' +
        '.dp-section{padding:20px 24px;border-radius:14px;}' +
        '.dp-section h2{font-size:18px;}' +
        '.dp-aux-grid{grid-template-columns:1fr 1fr 1fr!important;gap:10px;}' +
        '.dp-aux-btn{padding:12px 16px;font-size:14px;}' +
        '.dp-gear-btn{padding:12px 16px;font-size:14px;}' +
        '.dp-throttle-row{gap:20px;}' +
        '.dp-value{font-size:16px;}' +
        '.dp-slider{height:8px;}' +
        '.dp-slider::-webkit-slider-thumb{width:22px;height:22px;}' +
        '}' +
        '@media(min-width:1300px){' +
        '.dp-inner{padding:32px 64px 42px!important;gap:24px!important;' +
        'display:grid!important;grid-template-columns:1fr 1fr;align-items:start;}' +
        '.dp-header{grid-column:1/-1;}' +
        '.dp-status{grid-column:1/-1;}' +
        '.dp-footer{grid-column:1/-1;}' +
        '.dp-aux-grid{grid-template-columns:1fr 1fr 1fr!important;}' +
        '}' +
        '@media(max-width:400px){' +
        '.dp-inner{padding:10px 10px 18px!important;gap:10px!important;}' +
        '.dp-aux-grid{grid-template-columns:1fr!important;}' +
        '.dp-gear-buttons{grid-template-columns:1fr 1fr!important;}' +
        '.dp-throttle-row{grid-template-columns:1fr!important;}' +
        '.dp-status{flex-direction:column!important;gap:6px;}' +
        '.dp-status-item{min-width:0!important;}' +
        '}' +
        '</style></head><body>' +
        '<div class="driving-panel open"><div class="dp-inner">' + finalHtml + '</div></div>' +
        '<script>' + dpScript + '</' + 'script>' +
        '</body></html>');
    drivingPopout.document.close();

    panel.classList.remove('open');

    const chk = document.getElementById('chkDrivingPanel');
    if (chk) chk.checked = false;

    updateDrivingPopoutBtn();

    if (drivingPopoutPollInterval) clearInterval(drivingPopoutPollInterval);
    drivingPopoutPollInterval = setInterval(function() {
        if (!drivingPopout || drivingPopout.closed) {
            clearInterval(drivingPopoutPollInterval);
            drivingPopoutPollInterval = null;
            drivingPopout = null;
            restoreDrivingPanel();
        }
    }, 500);
}

function restoreDrivingPanel() {
    const panel = document.getElementById('drivingPanel');
    if (panel) panel.classList.add('open');
    const chk = document.getElementById('chkDrivingPanel');
    if (chk) chk.checked = true;
    updateDrivingPopoutBtn();
}

function updateDrivingPopoutBtn() {
    const btn = document.getElementById('dpPopoutBtn');
    if (!btn) return;
    const isPopped = drivingPopout && !drivingPopout.closed;
    btn.title = isPopped ? 'Regresar a la ventana' : 'Abrir en ventana independiente';
    btn.innerHTML = isPopped
        ? '<i class="fas fa-compress-arrows-alt"></i>'
        : '<i class="fas fa-external-link-alt"></i>';
}
