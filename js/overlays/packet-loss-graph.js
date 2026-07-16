// ═══════════════════════════════════════════════════════════
//  GRÁFICO DE PACKET LOSS
// ═══════════════════════════════════════════════════════════

function drawPacketLossGraph() {
    if (!packetLossCtx) return;
    const ctx = packetLossCtx;
    const width = packetLossCanvas.width;
    const height = packetLossCanvas.height;
    const ps = Math.min(width / 220, height / 90);
    const padLeft   = Math.round(28 * ps);
    const padRight  = Math.round(8 * ps);
    const padTop    = Math.round(6 * ps);
    const padBottom = Math.round(14 * ps);
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(13, 17, 23, 0.4)';
    ctx.fillRect(padLeft, padTop, plotW, plotH);

    ctx.strokeStyle = 'rgba(48, 54, 61, 0.35)';
    ctx.lineWidth = 1;
    const yTicks = [0, 0.5, 1];
    yTicks.forEach(f => {
        const y = padTop + plotH * (1 - f);
        ctx.beginPath();
        ctx.moveTo(padLeft, y);
        ctx.lineTo(width - padRight, y);
        ctx.stroke();
    });

    if (packetLossData.length > 1) {
        const grad = ctx.createLinearGradient(0, padTop, 0, padTop + plotH);
        grad.addColorStop(0, 'rgba(88, 166, 255, 0.15)');
        grad.addColorStop(1, 'rgba(88, 166, 255, 0)');

        ctx.beginPath();
        const step = plotW / (maxDataPoints - 1);
        packetLossData.forEach((val, i) => {
            const x = padLeft + i * step;
            const y = padTop + plotH * (1 - val);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        const lastX = padLeft + (packetLossData.length - 1) * step;
        ctx.lineTo(lastX, padTop + plotH);
        ctx.lineTo(padLeft, padTop + plotH);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        packetLossData.forEach((val, i) => {
            const x = padLeft + i * step;
            const y = padTop + plotH * (1 - val);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.strokeStyle = '#58a6ff';
        ctx.lineWidth = Math.max(1, Math.round(2 * ps));
        ctx.lineJoin = 'round';
        ctx.stroke();

        ctx.strokeStyle = 'rgba(88, 166, 255, 0.3)';
        ctx.lineWidth = Math.round(4 * ps);
        ctx.stroke();

        const last = packetLossData[packetLossData.length - 1];
        const lx = padLeft + (packetLossData.length - 1) * step;
        const ly = padTop + plotH * (1 - last);
        ctx.fillStyle = last > 0.6 ? '#da3633' : last > 0.3 ? '#d29922' : '#238636';
        ctx.beginPath();
        ctx.arc(lx, ly, Math.max(1, Math.round(3 * ps)), 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(lx, ly, Math.max(1, Math.round(1.5 * ps)), 0, 2 * Math.PI);
        ctx.fill();
    }

    ctx.fillStyle = '#8b949e';
    ctx.font = Math.max(7, Math.round(9 * ps)) + 'px Segoe UI';
    ctx.textAlign = 'right';
    ctx.fillText('100%', padLeft - Math.round(4*ps), padTop + Math.round(5*ps));
    ctx.fillText('50%', padLeft - Math.round(4*ps), padTop + plotH / 2 + Math.round(3*ps));
    ctx.fillText('0%', padLeft - Math.round(4*ps), padTop + plotH + Math.round(4*ps));

    ctx.textAlign = 'center';
    ctx.fillText('→ t', width - Math.round(10*ps), height - Math.round(2*ps));

    if (packetLossData.length > 0) {
        const val = packetLossData[packetLossData.length - 1];
        ctx.fillStyle = '#c9d1d9';
        ctx.font = 'bold ' + Math.max(8, Math.round(10 * ps)) + 'px Segoe UI';
        ctx.textAlign = 'left';
        ctx.fillText((val * 100).toFixed(1) + '%', width - Math.round(50*ps), Math.round(10*ps));
    }
}

function simulatePacketLoss() {
    const newVal = Math.random() * 0.8;
    packetLossData.push(newVal);
    if (packetLossData.length > maxDataPoints) packetLossData.shift();
    drawPacketLossGraph();
}
