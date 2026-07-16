// ═══════════════════════════════════════════════════════════
//  CONTROLES — Selección tipo, config modal, bindings
// ═══════════════════════════════════════════════════════════

function initControls() {
    document.querySelectorAll('.submenu-trigger').forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            this.querySelector('.chevron')?.classList.toggle('open');
            this.nextElementSibling?.classList.toggle('open');
        });
    });

    document.querySelectorAll('input[name="controlType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            wasdKeys.style.display = 'none';
            steeringWheel.style.display = 'none';
            gamepadControl.style.display = 'none';
            
            if (steeringInterval) {
                clearInterval(steeringInterval);
                steeringInterval = null;
            }
            
            if (this.value === 'teclado' && this.checked) {
                wasdKeys.style.display = 'block';
                showToast('Control por teclado activado');
            } else if (this.value === 'volante' && this.checked) {
                steeringWheel.style.display = 'block';
                steeringAngle = 0;
                steeringTarget = 0;
                drawSteeringWheel(0);
                steeringInterval = setInterval(simulateSteering, 50);
                showToast('Control por volante activado');
            } else if (this.value === 'mando' && this.checked) {
                gamepadControl.style.display = 'block';
                drawGamepad();
                showToast('Control por mando activado');
            }
        });
    });

    document.querySelectorAll('.cfg-trigger').forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.stopPropagation(); e.preventDefault();
            openCtrlModal(this.dataset.ctrl);
        });
    });

    ctrlModal?.addEventListener('click', function(e) { if(e.target===ctrlModal) closeCtrlModal(); });
}

// ─── Config Modal ───
function openCtrlModal(ctrlType) {
    const bindings = loadBindings(ctrlType);
    const titles = { teclado:'Configurar Teclado', volante:'Configurar Volante', mando:'Configurar Mando' };
    let html = '<h2>⚙ '+(titles[ctrlType]||'Configurar')+'</h2>';
    html += '<canvas id="ctrlImage" width="340" height="140" style="display:block;margin:0 auto 12px;border-radius:8px;background:#0d1117;"></canvas>';
    ALL_ACTIONS.forEach(a => {
        const key = bindings[a.id] || '—';
        html += `<div class="modal-bind-row"><span class="modal-bind-action">${a.label}</span><span class="modal-bind-key" data-action="${a.id}" onclick="startListening(this,'${ctrlType}','${a.id}')">${key}</span><button class="modal-bind-btn" onclick="clearBinding('${ctrlType}','${a.id}')">✕</button></div>`;
    });
    html += `<div class="modal-actions"><button class="modal-btn-reset" onclick="resetBindings('${ctrlType}')">↺ Por defecto</button><button class="modal-btn-close" onclick="closeCtrlModal()">Cerrar</button></div>`;
    ctrlModalBox.innerHTML = html;
    ctrlModal.classList.add('open');

    setTimeout(() => {
        const imgCanvas = document.getElementById('ctrlImage');
        if (imgCanvas) {
            imgCanvas.dataset.ctrlType = ctrlType;
            drawCtrlImage(imgCanvas, ctrlType, null);
        }
    }, 50);
}

function closeCtrlModal() { ctrlModal.classList.remove('open'); }
window.closeCtrlModal = closeCtrlModal;

function drawCtrlImage(canvas, ctrlType, highlightAction) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    if (ctrlType === 'teclado') drawKeyboardImage(ctx, w, h, highlightAction);
    else if (ctrlType === 'volante') drawWheelImage(ctx, w, h, highlightAction);
    else if (ctrlType === 'mando') drawGamepadImage(ctx, w, h, highlightAction);
}

function highlightBtn(ctx, pos, active) {
    if (active) {
        ctx.save();
        ctx.shadowColor = '#58a6ff'; ctx.shadowBlur = 12;
        ctx.strokeStyle = '#58a6ff'; ctx.lineWidth = 2;
        if (pos.r) { ctx.beginPath(); ctx.arc(pos.x, pos.y, pos.r+2, 0, Math.PI*2); ctx.stroke(); }
        else ctx.strokeRect(pos.x-2, pos.y-2, (pos.w||32)+4, (pos.h||32)+4);
        ctx.restore();
    }
}

function drawKeyboardImage(ctx, w, h, hl) {
    ctx.fillStyle='#1a1a1a'; ctx.fillRect(0,0,w,h);
    function key(x,y,ww,hh,label,actionId){
        const active = hl===actionId;
        ctx.fillStyle=active?'rgba(88,166,255,0.3)':'#2a2a2a';
        ctx.strokeStyle=active?'#58a6ff':'#444'; ctx.lineWidth=active?2:1;
        ctx.beginPath(); ctx.roundRect(x,y,ww,hh,5); ctx.fill(); ctx.stroke();
        ctx.fillStyle='#c9d1d9'; ctx.font='bold 13px Segoe UI'; ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(label,x+ww/2,y+hh/2);
        if(active) highlightBtn(ctx,{x:x-1,y:y-1,w:ww,h:hh},true);
    }
    key(170,30,32,32,'W','forward');
    key(132,68,32,32,'A','left');
    key(170,68,32,32,'S','backward');
    key(208,68,32,32,'D','right');
    key(120,105,130,25,'SPACE','stop');
    key(10,30,45,32,'Shift','boost');
    key(260,30,32,32,'H','horn');
    key(298,30,32,32,'L','light');
    ctx.fillStyle='#8b949e'; ctx.font='9px Segoe UI'; ctx.textAlign='center';
    ctx.fillText('Teclado',w/2,h-8);
}

function drawWheelImage(ctx, w, h, hl) {
    ctx.fillStyle='#0d1117'; ctx.fillRect(0,0,w,h);
    const cx=170,cy=70,rOuter=55,rHub=28;
    ctx.strokeStyle='#333'; ctx.lineWidth=10; ctx.beginPath(); ctx.arc(cx,cy,rOuter,0,Math.PI*2); ctx.stroke();
    ctx.fillStyle='#1a1a1a'; ctx.beginPath(); ctx.arc(cx,cy,rHub,0,Math.PI*2); ctx.fill();
    function wb(bx,by,br,color,label,actionId){
        const a=hl===actionId;
        ctx.fillStyle=color; ctx.beginPath(); ctx.arc(bx,by,br,0,Math.PI*2); ctx.fill();
        if(a) highlightBtn(ctx,{x:bx,y:by,r:br},true);
        ctx.fillStyle='#fff'; ctx.font='bold 7px Segoe UI'; ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(label,bx,by);
    }
    wb(103,65,7,'#d4a017','Y','horn');
    wb(135,58,7,'#3b82f6','B','boost');
    wb(160,90,7,'#ef4444','ST','forward');
    wb(175,62,7,'#22c55e','G','light');
    wb(190,100,7,'#444','A','stop');
    wb(210,58,7,'#333','X','backward');
    ctx.fillStyle='#333'; ctx.fillRect(40,110,30,18); ctx.fillRect(290,110,30,18);
    ctx.fillStyle='#8b949e'; ctx.font='8px'; ctx.fillText('LT',55,122); ctx.fillText('RT',305,122);
    if(hl==='backward') highlightBtn(ctx,{x:40,y:110,w:30,h:18},true);
    if(hl==='forward') highlightBtn(ctx,{x:290,y:110,w:30,h:18},true);
    ctx.fillStyle='#555'; ctx.fillRect(10,60,12,25); ctx.fillRect(318,60,12,25);
    if(hl==='left') highlightBtn(ctx,{x:10,y:60,w:12,h:25},true);
    if(hl==='right') highlightBtn(ctx,{x:318,y:60,w:12,h:25},true);
    ctx.fillStyle='#8b949e'; ctx.font='9px'; ctx.textAlign='center'; ctx.fillText('Volante Thrustmaster',w/2,h-8);
}

function drawGamepadImage(ctx, w, h, hl) {
    ctx.fillStyle='#0d1117'; ctx.fillRect(0,0,w,h);
    ctx.fillStyle='#1a1a1a'; ctx.strokeStyle='#444'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.roundRect(40,35,260,60,18); ctx.fill(); ctx.stroke();
    ctx.fillStyle='#333'; ctx.beginPath(); ctx.arc(90,65,18,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(190,65,18,0,Math.PI*2); ctx.fill();
    if(hl==='left'||hl==='right') highlightBtn(ctx,{x:95-(hl==='left'?10:0),y:65,r:18},true);
    function gb(bx,by,color,label,actionId){
        const a=hl===actionId;
        ctx.fillStyle=color; ctx.beginPath(); ctx.arc(bx,by,10,0,Math.PI*2); ctx.fill();
        if(a) highlightBtn(ctx,{x:bx,y:by,r:10},true);
        ctx.fillStyle='#fff'; ctx.font='bold 8px Segoe UI'; ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(label,bx,by);
    }
    gb(260,45,'#238636','A','stop');
    gb(245,65,'#da3633','B','horn');
    gb(275,65,'#58a6ff','X','light');
    gb(260,85,'#d29922','Y','boost');
    ctx.fillStyle='#444'; ctx.fillRect(55,28,30,8); ctx.fillRect(195,28,30,8);
    if(hl==='backward') highlightBtn(ctx,{x:55,y:28,w:30,h:8},true);
    if(hl==='forward') highlightBtn(ctx,{x:195,y:28,w:30,h:8},true);
    ctx.fillStyle='#8b949e'; ctx.font='9px'; ctx.textAlign='center'; ctx.fillText('LT',70,22); ctx.fillText('RT',210,22);
    ctx.fillText('Mando',w/2,h-8);
}

function highlightCtrlImage(actionId) {
    const img = document.getElementById('ctrlImage');
    if (!img) return;
    const ctrlType = img.dataset.ctrlType;
    if (ctrlType) drawCtrlImage(img, ctrlType, actionId);
}

window.startListening = function(el, ctrlType, actionId) {
    document.querySelectorAll('.modal-bind-key.listening').forEach(e => e.classList.remove('listening'));
    el.classList.add('listening'); el.textContent = '...';
    highlightCtrlImage(actionId);
    function capture(e) { e.preventDefault(); e.stopPropagation(); el.classList.remove('listening');
        let nk; if(ctrlType==='teclado'){ nk=e.key.length===1?e.key.toUpperCase():e.key; if(nk===' ')nk='Space'; }
        else { nk=prompt('Nombre del botón:',el.textContent)||el.textContent; }
        const b=loadBindings(ctrlType); b[actionId]=nk; saveBindings(ctrlType,b); el.textContent=nk;
        highlightCtrlImage(null);
        document.removeEventListener('keydown',capture,true); document.removeEventListener('click',capture,true); }
    if(ctrlType==='teclado'){ document.addEventListener('keydown',capture,true); setTimeout(()=>document.addEventListener('click',capture,true),10); }
    else { capture({preventDefault:()=>{},stopPropagation:()=>{}}); }
};

window.clearBinding = function(ctrlType, actionId) {
    const b=loadBindings(ctrlType); b[actionId]='—'; saveBindings(ctrlType,b); openCtrlModal(ctrlType);
};

window.resetBindings = function(ctrlType) {
    saveBindings(ctrlType,{...defaultBindings[ctrlType]}); openCtrlModal(ctrlType);
};

function loadBindings(ctrlType) {
    try { return JSON.parse(localStorage.getItem('ctrl_bindings_'+ctrlType)) || {...defaultBindings[ctrlType]}; }
    catch { return {...defaultBindings[ctrlType]}; }
}

function saveBindings(ctrlType, bindings) {
    localStorage.setItem('ctrl_bindings_'+ctrlType, JSON.stringify(bindings));
}
