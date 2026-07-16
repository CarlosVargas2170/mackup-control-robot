// ═══════════════════════════════════════════════════════════
//  SIDEBAR — Pop-out / regresar
// ═══════════════════════════════════════════════════════════

function popoutSidebar() {
    const sidebar = document.getElementById('appSidebar');
    if (!sidebar) return;

    if (sidebarPopout && !sidebarPopout.closed) {
        sidebarPopout.close();
        return;
    }

    const inner = document.querySelector('.app-sidebar-inner');
    if (!inner) return;
    const html = inner.innerHTML.replace(
        'onclick="popoutSidebar()"',
        'onclick="window.close()"'
    ).replace(
        'Abrir en ventana independiente',
        'Cerrar y regresar'
    );

    const styleEl = document.querySelector('style');
    const styles = styleEl ? styleEl.innerHTML : '';
    const scripts = document.querySelectorAll('script');
    const sbScript = scripts.length >= 3 ? scripts[scripts.length - 1].innerHTML : '';

    sidebarPopout = window.open('', 'MeseroRobot', 'width=380,height=750');
    sidebarPopout.document.write('<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">' +
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
        '<title>Mesero Robot</title>' +
        '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">' +
        '<style>');
    sidebarPopout.document.write(styles);
    sidebarPopout.document.write('body{overflow:hidden;height:100vh;}' +
        '.app-layout{display:block!important;}' +
        '.fullscreen-container{display:none!important;}' +
        '.app-sidebar{width:100%!important;height:100vh!important;border-left:none!important;}' +
        '.app-sidebar.open{width:100%!important;}' +
        '.app-sidebar-inner{width:100%!important;height:100%!important;}' +
        '</style></head><body>' +
        '<div class="app-sidebar open"><div class="app-sidebar-inner">' + html + '</div></div>' +
        '<script>' + sbScript + '</' + 'script>' +
        '</body></html>');
    sidebarPopout.document.close();

    sidebar.classList.remove('open');

    updatePopoutBtn();

    if (sidebarPollInterval) clearInterval(sidebarPollInterval);
    sidebarPollInterval = setInterval(function() {
        if (!sidebarPopout || sidebarPopout.closed) {
            clearInterval(sidebarPollInterval);
            sidebarPollInterval = null;
            sidebarPopout = null;
            restoreSidebar();
        }
    }, 500);
}

function restoreSidebar() {
    const sidebar = document.getElementById('appSidebar');
    if (sidebar) sidebar.classList.add('open');
    updatePopoutBtn();
}

function updatePopoutBtn() {
    const btn = document.querySelector('.sb-btn-popout');
    if (!btn) return;
    const isPopped = sidebarPopout && !sidebarPopout.closed;
    btn.title = isPopped ? 'Regresar a la ventana' : 'Abrir en ventana independiente';
    btn.innerHTML = isPopped
        ? '<i class="fas fa-compress-arrows-alt"></i>'
        : '<i class="fas fa-external-link-alt"></i>';
}
