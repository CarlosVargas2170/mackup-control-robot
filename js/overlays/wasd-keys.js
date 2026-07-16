// ═══════════════════════════════════════════════════════════
//  TECLAS WASD — Key listeners
// ═══════════════════════════════════════════════════════════

function initWasdKeys() {
    document.addEventListener('keydown', function(e) {
        const key = e.key.toLowerCase();
        if (['w', 'a', 's', 'd'].includes(key)) {
            const keyEl = document.querySelector(`.wasd-key[data-key="${key}"]`);
            if (keyEl && !keyEl.classList.contains('active')) {
                keyEl.classList.add('active');
            }
        }
    });

    document.addEventListener('keyup', function(e) {
        const key = e.key.toLowerCase();
        if (['w', 'a', 's', 'd'].includes(key)) {
            const keyEl = document.querySelector(`.wasd-key[data-key="${key}"]`);
            if (keyEl) {
                keyEl.classList.remove('active');
            }
        }
    });
}
