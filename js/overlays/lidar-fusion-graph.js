// ═══════════════════════════════════════════════════════════
//  GRÁFICO FUSIÓN LIDAR + RADAR FRONTAL
// ═══════════════════════════════════════════════════════════

function drawLidarFusionGraph() {
    if (!lidarFusionCtx) return;
    const ctx = lidarFusionCtx;
    const w = lidarFusionCanvas.width;
    const h = lidarFusionCanvas.height;
    const cx = w / 2;
    const cy = h * 0.58;
    const s = Math.min(w, h) / 320;
    const radius = Math.min(w, h) / 2 - 16 * s;

    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(88, 166, 255, 0.95)';
    ctx.font = 'bold ' + Math.max(11, Math.round(14 * s)) + 'px Segoe UI';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    ctx.strokeStyle = 'rgba(48, 54, 61, 0.35)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (radius * i) / 4, 0, Math.PI * 2);
        ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(48, 54, 61, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - radius, cy); ctx.lineTo(cx + radius, cy);
    ctx.moveTo(cx, cy - radius); ctx.lineTo(cx, cy + radius);
    ctx.stroke();

    ctx.fillStyle = 'rgba(139, 148, 158, 0.5)';
    ctx.font = Math.max(7, Math.round(8 * s)) + 'px Segoe UI';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('0.5m', cx + 3, cy - radius * 0.25);
    ctx.fillText('1m',   cx + 3, cy - radius * 0.5);
    ctx.fillText('1.5m', cx + 3, cy - radius * 0.75);
    ctx.fillText('2m',   cx + 3, cy - radius);

    ctx.fillStyle = 'rgba(139, 148, 158, 0.6)';
    ctx.font = 'bold ' + Math.max(7, Math.round(8 * s)) + 'px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('0° F',  cx,             cy - radius - 4 * s);
    ctx.fillText('90°',   cx + radius + 6 * s, cy);
    ctx.fillText('180°',  cx,             cy + radius + 8 * s);
    ctx.fillText('270°',  cx - radius - 6 * s, cy);

    const fovHalf = Math.PI / 2;
    const fovStart = -Math.PI / 2 - fovHalf;
    const fovEnd   = -Math.PI / 2 + fovHalf;
    ctx.fillStyle = 'rgba(88, 166, 255, 0.10)';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, fovStart, fovEnd);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(88, 166, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();

    const sectors = [
        { name: 'FI', angle: -Math.PI/2 - Math.PI/3, value: radarFrontValues.FI },
        { name: 'FC', angle: -Math.PI/2,            value: radarFrontValues.FC },
        { name: 'FD', angle: -Math.PI/2 + Math.PI/3, value: radarFrontValues.FD }
    ];
    const sectorHalf = Math.PI / 6;

    sectors.forEach(sector => {
        const v = Math.max(0, Math.min(FUSION_MAX_CM, sector.value));
        if (v > 0) {
            const c = getRadarColor(v);
            const r = Math.max(6 * s, v * FUSION_CM_TO_RADIUS * radius);
            const a0 = sector.angle - sectorHalf;
            const a1 = sector.angle + sectorHalf;

            ctx.fillStyle = c.fill;
            ctx.strokeStyle = c.stroke;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, r, a0, a1);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            const tipX = cx + Math.cos(sector.angle) * r;
            const tipY = cy + Math.sin(sector.angle) * r;
            ctx.strokeStyle = c.stroke;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(tipX, tipY);
            ctx.stroke();

            const silSize = Math.max(8, 12 * s);
            drawRadarSilhouette(ctx, tipX, tipY, silSize, c);
        }

        const labelR = radius + 14 * s;
        const lx = cx + Math.cos(sector.angle) * labelR;
        const ly = cy + Math.sin(sector.angle) * labelR;
        ctx.fillStyle = (v > 0) ? getRadarColor(v).text : 'rgba(139, 148, 158, 0.5)';
        ctx.font = 'bold ' + Math.max(10, Math.round(12 * s)) + 'px Segoe UI';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sector.name, lx, ly);

        const valText = (v <= 0) ? '0cm' : (Math.round(v) + 'cm');
        const valX = cx + Math.cos(sector.angle) * (radius * 0.55);
        const valY = cy + Math.sin(sector.angle) * (radius * 0.55);
        const tw = ctx.measureText(valText).width + 8;
        ctx.fillStyle = (v > 0) ? 'rgba(10, 14, 20, 0.75)' : 'rgba(48, 54, 61, 0.55)';
        ctx.fillRect(valX - tw / 2, valY - 8 * s, tw, 16 * s);
        ctx.fillStyle = (v > 0) ? getRadarColor(v).text : 'rgba(139, 148, 158, 0.5)';
        ctx.fillText(valText, valX, valY);
    });

    const sweepEndX = cx + Math.cos(lidarSweepAngle) * radius;
    const sweepEndY = cy + Math.sin(lidarSweepAngle) * radius;
    for (let t = 1; t <= 12; t++) {
        const tAngle = lidarSweepAngle - (t * 0.04);
        const tx = cx + Math.cos(tAngle) * radius;
        const ty = cy + Math.sin(tAngle) * radius;
        ctx.strokeStyle = `rgba(88, 166, 255, ${0.18 - t * 0.013})`;
        ctx.lineWidth = Math.max(1, 2 * s);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(tx, ty);
        ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(88, 166, 255, 0.85)';
    ctx.lineWidth = Math.max(1, Math.round(2 * s));
    ctx.shadowColor = '#58a6ff';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(sweepEndX, sweepEndY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    lidarObstacles.forEach(ob => {
        const a = ob.angle;
        const r = ob.dist * radius;
        const ox = cx + Math.cos(a) * r;
        const oy = cy + Math.sin(a) * r;
        const triSize = Math.max(4, Math.round(7 * s));

        ctx.save();
        ctx.translate(ox, oy);
        ctx.rotate(a + Math.PI / 2);
        ctx.fillStyle = 'rgba(218, 54, 51, 0.7)';
        ctx.strokeStyle = 'rgba(255, 80, 80, 0.9)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -triSize);
        ctx.lineTo(triSize * 0.85, triSize * 0.7);
        ctx.lineTo(-triSize * 0.85, triSize * 0.7);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    });

    const robW = Math.max(12, Math.round(18 * s));
    const robH = Math.max(18, Math.round(26 * s));
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = 'rgba(201, 209, 217, 0.9)';
    ctx.strokeStyle = 'rgba(88, 166, 255, 0.7)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(-robW / 2, -robH / 2, robW, robH, 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(88, 166, 255, 0.4)';
    ctx.fillRect(-robW / 2 + 3, -robH / 2 + 4, robW - 6, robH / 3);
    ctx.fillStyle = 'rgba(88, 166, 255, 0.95)';
    ctx.beginPath();
    ctx.moveTo(0, -robH / 2 - Math.max(3, 4 * s));
    ctx.lineTo(-Math.max(2, 2.5 * s), -robH / 2);
    ctx.lineTo(Math.max(2, 2.5 * s), -robH / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function simulateLidarFusion() {
    lidarSweepAngle += (2 * Math.PI) / 200;
    if (lidarSweepAngle > Math.PI * 1.5) lidarSweepAngle -= 2 * Math.PI;

    if (Math.random() < 0.06) {
        const frontAngle = -Math.PI + Math.random() * Math.PI;
        const dist = 0.15 + Math.random() * 0.8;
        lidarObstacles.push({ angle: frontAngle, dist: dist });
        if (lidarObstacles.length > 8) lidarObstacles.shift();
    }
    if (Math.random() < 0.04 && lidarObstacles.length > 2) {
        lidarObstacles.shift();
    }

    let fiClosest = Infinity, fcClosest = Infinity, fdClosest = Infinity;
    const FI_START = -Math.PI;
    const FI_END   = -2 * Math.PI / 3;
    const FC_START = -2 * Math.PI / 3;
    const FC_END   = -Math.PI / 3;
    const FD_START = -Math.PI / 3;
    const FD_END   = 0;

    lidarObstacles.forEach(ob => {
        if (ob.angle < -Math.PI || ob.angle > 0) return;
        if (ob.angle >= FI_START && ob.angle < FI_END) {
            fiClosest = Math.min(fiClosest, ob.dist);
        } else if (ob.angle >= FC_START && ob.angle < FC_END) {
            fcClosest = Math.min(fcClosest, ob.dist);
        } else if (ob.angle >= FD_START && ob.angle <= FD_END) {
            fdClosest = Math.min(fdClosest, ob.dist);
        }
    });

    const fiTarget = fiClosest === Infinity ? 0 : Math.round(fiClosest * 300);
    const fcTarget = fcClosest === Infinity ? 0 : Math.round(fcClosest * 300);
    const fdTarget = fdClosest === Infinity ? 0 : Math.round(fdClosest * 300);

    const smooth = 0.25;
    radarFrontValues.FI = Math.round(radarFrontValues.FI + (fiTarget - radarFrontValues.FI) * smooth);
    radarFrontValues.FC = Math.round(radarFrontValues.FC + (fcTarget - radarFrontValues.FC) * smooth);
    radarFrontValues.FD = Math.round(radarFrontValues.FD + (fdTarget - radarFrontValues.FD) * smooth);

    drawLidarFusionGraph();
}
