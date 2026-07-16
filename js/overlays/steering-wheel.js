// ═══════════════════════════════════════════════════════════
//  VOLANTE (Steering Wheel) — Dibujo y simulación
// ═══════════════════════════════════════════════════════════

function drawSteeringWheel(angle) {
    if (!steeringCtx) return;
    const ctx = steeringCtx;
    const width = steeringCanvas.width;
    const height = steeringCanvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const s = Math.min(width, height) / 300;
    const rimR = Math.round(132 * s);
    const spokeW = Math.max(2, Math.round(15 * s));
    const hubR = Math.round(63 * s);

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((angle * Math.PI) / 180);

    const rimGrad = ctx.createRadialGradient(0, 0, rimR - 10*s, 0, 0, rimR + 6*s);
    rimGrad.addColorStop(0, '#3a3a3a');
    rimGrad.addColorStop(0.5, '#2a2a2a');
    rimGrad.addColorStop(1, '#1a1a1a');
    ctx.strokeStyle = rimGrad;
    ctx.lineWidth = Math.max(1, Math.round(14 * s));
    ctx.beginPath();
    ctx.arc(0, 0, rimR, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = spokeW;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-hubR + 8*s, -8*s);
    ctx.lineTo(-rimR + 15*s, -38*s);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(hubR - 8*s, -8*s);
    ctx.lineTo(rimR - 15*s, -38*s);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, hubR - 8*s);
    ctx.lineTo(0, rimR - 15*s);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(88, 166, 255, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, rimR, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(0, 0, hubR, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = Math.max(1, Math.round(2 * s));
    ctx.beginPath();
    ctx.arc(0, 0, hubR, 0, 2 * Math.PI);
    ctx.stroke();

    const bfs = Math.max(6, Math.round(12 * s));
    function drawBtn(bx, by, br, color, label) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();
        if (label) {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold ' + bfs + 'px Segoe UI';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, bx, by);
        }
    }

    drawBtn(-45*s, -27*s, 11*s, '#d4a017', 'Y');
    drawBtn(-48*s, 3*s, 11*s, '#3b82f6', 'B');
    drawBtn(-42*s, 33*s, 11*s, '#22c55e', 'G');
    drawBtn(-30*s, 60*s, 9*s, '#444', 'X');

    drawBtn(45*s, -23*s, 11*s, '#333', 'A');
    drawBtn(48*s, 12*s, 11*s, '#ef4444', 'R');
    drawBtn(42*s, 42*s, 11*s, '#333', 'L');

    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(72*s, 57*s, 15*s, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#555';
    ctx.lineWidth = Math.max(1, Math.round(2 * s));
    ctx.stroke();
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
        const a = (i / 5) * 2 * Math.PI - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(72*s + Math.cos(a)*11*s, 57*s + Math.sin(a)*11*s);
        ctx.lineTo(72*s + Math.cos(a)*15*s, 57*s + Math.sin(a)*11*s);
        ctx.stroke();
    }
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(72*s, 50*s, 4*s, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(0, 33*s, 14*s, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = Math.max(1, Math.round(2 * s));
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold ' + Math.max(6, Math.round(9 * s)) + 'px Segoe UI';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('START', 0, 33*s);

    ctx.fillStyle = '#555';
    ctx.fillRect(-rimR - 12*s, -9*s, 11*s, 18*s);
    ctx.fillRect(rimR + 2*s, -9*s, 11*s, 18*s);

    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-rimR - 12*s, 12*s, 11*s, 8*s);
    ctx.fillRect(rimR + 2*s, 12*s, 11*s, 8*s);

    ctx.restore();

    ctx.fillStyle = '#8b949e';
    ctx.font = Math.max(8, Math.round(10 * s)) + 'px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText(Math.round(angle) + '°', cx, height - Math.max(3, Math.round(5 * s)));
}

function simulateSteering() {
    if (Math.random() < 0.05) {
        steeringTarget = (Math.random() - 0.5) * 90;
    }
    const diff = steeringTarget - steeringAngle;
    steeringAngle += diff * 0.1;
    drawSteeringWheel(steeringAngle);
}
