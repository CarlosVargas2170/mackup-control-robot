// ═══════════════════════════════════════════════════════════
//  GRÁFICO GPS / NAVEGACIÓN
// ═══════════════════════════════════════════════════════════

function drawGpsGraph() {
    if (!gpsCtx || !gpsCanvas) return;
    const ctx = gpsCtx, W = gpsCanvas.width, H = gpsCanvas.height;
    ctx.clearRect(0, 0, W, H);

    const last = gpsData.length > 0 ? gpsData[gpsData.length - 1] : { x: 0, y: 0, heading: -Math.PI / 2 };
    const originX = last.x;
    const originY = last.y;

    ctx.strokeStyle = 'rgba(48, 54, 61, 0.25)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    const offsetX = ((originX % gridSize) + gridSize) % gridSize;
    const offsetY = ((originY % gridSize) + gridSize) % gridSize;
    for (let x = -offsetX; x <= W; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = -offsetY; y <= H; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    const cx = W / 2, cy = H / 2;

    if (gpsData.length > 1) {
        const trail = gpsData.slice(-150);
        ctx.strokeStyle = 'rgba(88, 166, 255, 0.35)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx + (trail[0].x - originX), cy + (trail[0].y - originY));
        for (let i = 1; i < trail.length; i++) {
            ctx.lineTo(cx + (trail[i].x - originX), cy + (trail[i].y - originY));
        }
        ctx.stroke();

        for (let i = 0; i < trail.length; i++) {
            const alpha = 0.12 + (i / trail.length) * 0.55;
            ctx.fillStyle = `rgba(88, 166, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(cx + (trail[i].x - originX), cy + (trail[i].y - originY), 2.2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(last.heading);
    ctx.fillStyle = '#58a6ff';
    ctx.shadowColor = '#58a6ff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(12, 0);
    ctx.lineTo(-8, -7);
    ctx.lineTo(-8, 7);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();

    const xM = (last.x / 4).toFixed(1), yM = (last.y / 4).toFixed(1);
    ctx.fillStyle = 'rgba(139, 148, 158, 0.65)';
    ctx.font = '11px "Segoe UI", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`X: ${xM}m  Y: ${yM}m`, 8, H - 8);
    ctx.textAlign = 'right';
    ctx.fillText(`${(last.heading * 180 / Math.PI).toFixed(0)}\u00B0`, W - 8, H - 8);

    ctx.fillStyle = 'rgba(218, 54, 51, 0.55)';
    ctx.font = 'bold 11px "Segoe UI"';
    ctx.textAlign = 'center';
    ctx.fillText('N', W - 16, 16);
}

function simulateGps() {
    const last = gpsData.length > 0 ? gpsData[gpsData.length - 1] : { x: 0, y: 0, heading: -Math.PI / 2 };
    const speed = 1 + Math.random() * 4;
    const turn = (Math.random() - 0.5) * 0.3;
    const heading = last.heading + turn;
    const x = last.x + Math.cos(heading) * speed;
    const y = last.y + Math.sin(heading) * speed;
    gpsData.push({ x: x, y: y, heading: heading });
    if (gpsData.length > 200) gpsData.shift();
    drawGpsGraph();
}
