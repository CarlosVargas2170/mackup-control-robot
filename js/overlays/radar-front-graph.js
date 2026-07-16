// ═══════════════════════════════════════════════════════════
//  GRÁFICO RADAR FRONTAL (FI / FC / FD en cm)
// ═══════════════════════════════════════════════════════════

function getRadarColor(cm) {
    if (cm <= 0)   return { fill: 'rgba(48, 54, 61, 0.4)',  stroke: 'rgba(139, 148, 158, 0.6)',  text: 'rgba(139, 148, 158, 0.6)' };
    if (cm < 80)   return { fill: 'rgba(218, 54, 51, 0.55)', stroke: 'rgba(255, 80, 80, 0.9)',     text: 'rgba(255, 100, 100, 1)' };
    if (cm < 150)  return { fill: 'rgba(210, 153, 34, 0.55)', stroke: 'rgba(240, 192, 100, 0.9)',   text: 'rgba(255, 200, 100, 1)' };
    return            { fill: 'rgba(46, 160, 67, 0.55)',  stroke: 'rgba(80, 200, 120, 0.9)',    text: 'rgba(120, 230, 160, 1)' };
}

function drawRadarSilhouette(ctx, x, y, size, color) {
    ctx.save();
    ctx.translate(x, y);
    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.8);
    grad.addColorStop(0, color.stroke.replace(/[\d.]+\)$/, '0.35)'));
    grad.addColorStop(1, color.stroke.replace(/[\d.]+\)$/, '0)'));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color.fill;
    ctx.strokeStyle = color.stroke;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-size / 2, -size / 2, size, size, 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = color.stroke;
    ctx.globalAlpha = 0.3;
    ctx.fillRect(-size / 2, -size / 2, size, 2);
    ctx.globalAlpha = 1;
    ctx.restore();
}

function drawRadarFrontGraph() {
    if (!radarFrontCtx) return;
    const ctx = radarFrontCtx;
    const w = radarFrontCanvas.width;
    const h = radarFrontCanvas.height;
    const cx = w / 2;
    const cy = h * 0.62;
    const s = Math.min(w, h) / 260;

    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(88, 166, 255, 0.95)';
    ctx.font = 'bold ' + Math.max(11, Math.round(15 * s)) + 'px Segoe UI';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const maxCm = 300;
    const labels = [
        { name: 'FI', angle: -Math.PI/2 - Math.PI/3, value: radarFrontValues.FI },
        { name: 'FC', angle: -Math.PI/2,            value: radarFrontValues.FC },
        { name: 'FD', angle: -Math.PI/2 + Math.PI/3, value: radarFrontValues.FD }
    ];

    const maxR = Math.min(w * 0.45, h * 0.40);

    ctx.strokeStyle = 'rgba(48, 54, 61, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (maxR * i) / 3, 0, Math.PI * 2);
        ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(48, 54, 61, 0.25)';
    ctx.beginPath();
    ctx.moveTo(cx - maxR, cy); ctx.lineTo(cx + maxR, cy);
    ctx.stroke();

    ctx.fillStyle = 'rgba(139, 148, 158, 0.55)';
    ctx.font = Math.max(8, Math.round(9 * s)) + 'px Segoe UI';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('100cm', cx + 4, cy - (maxR / 3));
    ctx.fillText('200cm', cx + 4, cy - (maxR * 2 / 3));
    ctx.fillText('300cm', cx + 4, cy - maxR);

    const sectorHalf = Math.PI / 6;
    labels.forEach(sector => {
        const v = Math.max(0, Math.min(maxCm, sector.value));
        const ratio = v / maxCm;
        const r = maxR * ratio;
        const c = getRadarColor(v);

        if (v > 0) {
            const a0 = sector.angle - sectorHalf;
            const a1 = sector.angle + sectorHalf;
            ctx.fillStyle = c.fill;
            ctx.strokeStyle = c.stroke;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, Math.max(8, r), a0, a1);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            const tipX = cx + Math.cos(sector.angle) * Math.max(8, r);
            const tipY = cy + Math.sin(sector.angle) * Math.max(8, r);
            ctx.strokeStyle = c.stroke;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(tipX, tipY);
            ctx.stroke();
        }

        if (v > 0) {
            const silSize = Math.max(8, 14 * s);
            const silX = cx + Math.cos(sector.angle) * Math.max(8, r);
            const silY = cy + Math.sin(sector.angle) * Math.max(8, r);
            drawRadarSilhouette(ctx, silX, silY, silSize, c);
        }

        const labelR = maxR + 14 * s;
        const lx = cx + Math.cos(sector.angle) * labelR;
        const ly = cy + Math.sin(sector.angle) * labelR;
        ctx.fillStyle = (v > 0) ? c.text : 'rgba(139, 148, 158, 0.5)';
        ctx.font = 'bold ' + Math.max(11, Math.round(14 * s)) + 'px Segoe UI';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sector.name, lx, ly);

        const valText = (v <= 0) ? '0cm' : (Math.round(v) + 'cm');
        const valX = cx + Math.cos(sector.angle) * (maxR * 0.55);
        const valY = cy + Math.sin(sector.angle) * (maxR * 0.55);
        const tw = ctx.measureText(valText).width + 8;
        ctx.fillStyle = (v > 0) ? 'rgba(10, 14, 20, 0.75)' : 'rgba(48, 54, 61, 0.55)';
        ctx.fillRect(valX - tw / 2, valY - 9 * s, tw, 18 * s);
        ctx.fillStyle = (v > 0) ? c.text : 'rgba(139, 148, 158, 0.5)';
        ctx.fillText(valText, valX, valY);
    });

    const carW = Math.max(14, Math.round(20 * s));
    const carH = Math.max(22, Math.round(30 * s));
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = 'rgba(201, 209, 217, 0.9)';
    ctx.strokeStyle = 'rgba(88, 166, 255, 0.8)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(-carW / 2, -carH / 2, carW, carH, 3);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(88, 166, 255, 0.4)';
    ctx.fillRect(-carW / 2 + 3, -carH / 2 + 4, carW - 6, carH / 3);
    ctx.fillStyle = 'rgba(88, 166, 255, 0.95)';
    ctx.beginPath();
    ctx.moveTo(0, -carH / 2 - Math.max(4, 5 * s));
    ctx.lineTo(-Math.max(3, 4 * s), -carH / 2);
    ctx.lineTo(Math.max(3, 4 * s), -carH / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function simulateRadarFront() {
    function nextVal(prev) {
        if (prev <= 0) {
            return Math.random() < 0.25 ? Math.max(20, 30 + Math.random() * 270) : 0;
        }
        const target = Math.random() < 0.15 ? 0 : (30 + Math.random() * 270);
        return Math.max(0, Math.min(300, prev + (target - prev) * 0.2 + (Math.random() - 0.5) * 25));
    }
    radarFrontValues.FI = Math.round(nextVal(radarFrontValues.FI));
    radarFrontValues.FC = Math.round(nextVal(radarFrontValues.FC));
    radarFrontValues.FD = Math.round(nextVal(radarFrontValues.FD));
    drawRadarFrontGraph();
}
