// ═══════════════════════════════════════════════════════════
//  GRÁFICO DE ACELERACIÓN (Velocímetro)
// ═══════════════════════════════════════════════════════════

function drawAccelGraph() {
    if (!accelCtx) return;
    const ctx = accelCtx;
    const width = accelCanvas.width;
    const height = accelCanvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;

    ctx.clearRect(0, 0, width, height);

    const startAngle = (135 * Math.PI) / 180;
    const endAngle = (405 * Math.PI) / 180;
    const maxSpeed = 120;

    ctx.strokeStyle = 'rgba(48, 54, 61, 0.2)';
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.stroke();

    const currentSpeedVal = accelData.length > 0 ? accelData[accelData.length - 1] : 0;

    for (let speed = 0; speed <= maxSpeed; speed += 20) {
        const angle = startAngle + ((speed / maxSpeed) * (endAngle - startAngle));
        const isMain = speed % 40 === 0;
        
        const markLength = isMain ? 15 : 8;
        const markStart = radius - markLength;
        const markEnd = radius;
        
        ctx.strokeStyle = isMain ? 'rgba(201, 209, 217, 0.35)' : 'rgba(139, 148, 158, 0.25)';
        ctx.lineWidth = isMain ? 3 : 2;
        ctx.beginPath();
        ctx.moveTo(
            centerX + markStart * Math.cos(angle),
            centerY + markStart * Math.sin(angle)
        );
        ctx.lineTo(
            centerX + markEnd * Math.cos(angle),
            centerY + markEnd * Math.sin(angle)
        );
        ctx.stroke();

        if (isMain) {
            ctx.fillStyle = 'rgba(139, 148, 158, 0.45)';
            ctx.font = '12px Segoe UI';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const textRadius = radius - 30;
            const textX = centerX + textRadius * Math.cos(angle);
            const textY = centerY + textRadius * Math.sin(angle);
            ctx.fillText(speed.toString(), textX, textY);
        }
    }

    const needleAngle = startAngle + ((currentSpeedVal / maxSpeed) * (endAngle - startAngle));
    const needleLength = radius - 10;
    
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(centerX + 2, centerY + 2);
    ctx.lineTo(
        centerX + 2 + needleLength * Math.cos(needleAngle),
        centerY + 2 + needleLength * Math.sin(needleAngle)
    );
    ctx.stroke();

    ctx.shadowColor = '#58a6ff';
    ctx.shadowBlur = 8;
    ctx.strokeStyle = '#58a6ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
        centerX + needleLength * Math.cos(needleAngle),
        centerY + needleLength * Math.sin(needleAngle)
    );
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.shadowColor = '#58a6ff';
    ctx.shadowBlur = 6;
    ctx.fillStyle = '#58a6ff';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#0d1117';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
    ctx.fill();

    ctx.shadowColor = 'rgba(88, 166, 255, 0.5)';
    ctx.shadowBlur = 10;
    ctx.fillStyle = 'rgba(240, 246, 252, 0.75)';
    ctx.font = 'bold 36px Segoe UI';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(Math.round(currentSpeedVal).toString(), centerX, centerY + 50);
    ctx.shadowBlur = 0;

    ctx.fillStyle = 'rgba(139, 148, 158, 0.4)';
    ctx.font = '14px Segoe UI';
    ctx.fillText('km/h', centerX, centerY + 75);
}

function simulateAccel() {
    if (Math.random() < 0.05) {
        targetSpeed = Math.random() * 120;
    }
    const diff = targetSpeed - currentSpeed;
    currentSpeed += diff * 0.1;
    currentSpeed = Math.max(0, Math.min(120, currentSpeed));
    accelData[0] = currentSpeed;
    drawAccelGraph();
}
