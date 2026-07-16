// ═══════════════════════════════════════════════════════════
//  UTILIDADES
// ═══════════════════════════════════════════════════════════

function showToast(msg) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.style.cssText = `
            position:fixed;bottom:30px;left:50%;transform:translateX(-50%);
            background:#2d2d2d;border:1px solid #4a4a4a;
            padding:8px 22px;border-radius:40px;color:#ccc;
            font-size:13px;font-family:'Segoe UI',sans-serif;
            box-shadow:0 6px 20px rgba(0,0,0,0.6);
            pointer-events:none;opacity:0;
            transition:opacity 0.3s;z-index:9999;
        `;
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => { toast.style.opacity = '0'; }, 1500);
}
