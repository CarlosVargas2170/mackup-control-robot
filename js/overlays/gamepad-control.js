// ═══════════════════════════════════════════════════════════
//  CONTROL DE MANDO (Gamepad) — Dibujo
// ═══════════════════════════════════════════════════════════

function drawGamepad() {
    if (!gamepadCtx) return;
    const ctx = gamepadCtx;
    const width = gamepadCanvas.width;
    const height = gamepadCanvas.height;

    ctx.clearRect(0, 0, width, height);
    const sx = width / 270;
    const sy = height / 180;
    const gs = Math.min(sx, sy);

    ctx.fillStyle = 'rgba(48, 54, 61, 0.4)';
    ctx.strokeStyle = 'rgba(88, 166, 255, 0.3)';
    ctx.lineWidth = Math.max(1, Math.round(2 * gs));

    ctx.beginPath();
    ctx.roundRect(30*sx, 45*sy, 210*sx, 90*sy, Math.round(22 * gs));
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(88, 166, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(75*sx, 90*sy, 18*gs, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(195*sx, 90*sy, 18*gs, 0, 2 * Math.PI);
    ctx.fill();

    const buttons = [
        { x: Math.round(165*sx), y: Math.round(68*sy), label: 'Y', color: '#d29922' },
        { x: Math.round(188*sx), y: Math.round(90*sy), label: 'B', color: '#da3633' },
        { x: Math.round(165*sx), y: Math.round(113*sy), label: 'A', color: '#238636' },
        { x: Math.round(143*sx), y: Math.round(90*sy), label: 'X', color: '#58a6ff' }
    ];

    const btnR = Math.round(9 * gs);
    const btnFont = Math.max(7, Math.round(12 * gs));
    buttons.forEach(btn => {
        ctx.fillStyle = btn.color;
        ctx.beginPath();
        ctx.arc(btn.x, btn.y, btnR, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold ' + btnFont + 'px Segoe UI';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(btn.label, btn.x, btn.y);
    });

    ctx.fillStyle = 'rgba(88, 166, 255, 0.4)';
    ctx.fillRect(68*sx, 75*sy, 15*sx, 30*sy);
    ctx.fillRect(60*sx, 83*sy, 30*sx, 15*sy);

    ctx.fillStyle = '#8b949e';
    ctx.font = Math.max(9, Math.round(14 * gs)) + 'px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('GAMEPAD', width / 2, height - Math.max(4, Math.round(8 * sy)));
}
