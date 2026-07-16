// ═══════════════════════════════════════════════════════════
//  GRÁFICO LIDAR
// ═══════════════════════════════════════════════════════════

function drawLidarGraph() {
    if (!lidarCtx) return;
    const ctx = lidarCtx;
    const width = lidarCanvas.width;
    const height = lidarCanvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) / 2 - 8;
    const s = Math.min(width, height) / 220;

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(48, 54, 61, 0.35)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (radius * i) / 4, 0, 2 * Math.PI);
        ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(48, 54, 61, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - radius, cy); ctx.lineTo(cx + radius, cy);
    ctx.moveTo(cx, cy - radius); ctx.lineTo(cx, cy + radius);
    ctx.stroke();

    const fovHalf = (60 * Math.PI) / 180;
    const fovStart = -Math.PI / 2 - fovHalf;
    const fovEnd   = -Math.PI / 2 + fovHalf;
    ctx.fillStyle = 'rgba(88, 166, 255, 0.18)';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, fovStart, fovEnd);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(88, 166, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = 'rgba(139, 148, 158, 0.5)';
    ctx.font = Math.max(7, Math.round(9 * s)) + 'px Segoe UI';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const distLabels = ['0.5m', '1m', '1.5m', '2m'];
    for (let i = 1; i <= 4; i++) {
        const r = (radius * i) / 4;
        ctx.fillText(distLabels[i-1], cx, cy - r + Math.max(6, 8 * s));
    }

    ctx.fillStyle = 'rgba(139, 148, 158, 0.6)';
    ctx.font = 'bold ' + Math.max(7, Math.round(9 * s)) + 'px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('0°',   cx,             cy - radius - 2);
    ctx.fillText('90°',  cx + radius + 8, cy);
    ctx.fillText('180°', cx,             cy + radius + 8);
    ctx.fillText('270°', cx - radius - 8, cy);

    const sweepLen = radius;
    const sweepEndX = cx + Math.cos(lidarSweepAngle) * sweepLen;
    const sweepEndY = cy + Math.sin(lidarSweepAngle) * sweepLen;
    const tailLen = 50 * s;
    for (let t = 1; t <= 12; t++) {
        const tAngle = lidarSweepAngle - (t * 0.04);
        const tx = cx + Math.cos(tAngle) * sweepLen;
        const ty = cy + Math.sin(tAngle) * sweepLen;
        ctx.strokeStyle = `rgba(88, 166, 255, ${0.18 - t * 0.013})`;
        ctx.lineWidth = Math.max(1, 2 * s);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        if (t * 0.04 * sweepLen > tailLen) break;
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
        ctx.fillStyle = 'rgba(218, 54, 51, 0.75)';
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

    const robW = Math.max(8, Math.round(14 * s));
    const robH = Math.max(5, Math.round(8 * s));
    ctx.fillStyle = 'rgba(201, 209, 217, 0.85)';
    ctx.strokeStyle = 'rgba(88, 166, 255, 0.7)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(cx - robW / 2, cy - robH / 2, robW, robH, 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(88, 166, 255, 0.95)';
    ctx.beginPath();
    ctx.moveTo(cx, cy - robH / 2 - Math.max(3, 4 * s));
    ctx.lineTo(cx - Math.max(2, 2.5 * s), cy - robH / 2);
    ctx.lineTo(cx + Math.max(2, 2.5 * s), cy - robH / 2);
    ctx.closePath();
    ctx.fill();
}

function simulateLidar() {
    lidarSweepAngle += (2 * Math.PI) / 200;
    if (lidarSweepAngle > Math.PI * 1.5) lidarSweepAngle -= 2 * Math.PI;

    if (Math.random() < 0.04) {
        if (lidarObstacles.length < 4) {
            lidarObstacles.push({
                angle: Math.random() * 2 * Math.PI,
                dist:  0.35 + Math.random() * 0.55
            });
        } else if (lidarObstacles.length > 0 && Math.random() < 0.5) {
            lidarObstacles.shift();
        }
    }
    drawLidarGraph();
}
