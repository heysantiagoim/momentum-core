// ===== STATE =====
const DATA_VERSION = 'v4_responsive';
let models = JSON.parse(localStorage.getItem('wbc_models')) || [];
let rates = JSON.parse(localStorage.getItem('wbc_rates')) || {...RATES};
let currentShift = localStorage.getItem('wbc_shift') || 'mañana';
let currentPeriod = parseInt(localStorage.getItem('wbc_period')) || 3;
// Forzar recarga si la versión cambió o no hay datos
if(!models.length || localStorage.getItem('wbc_version') !== DATA_VERSION){
  models = SAMPLE.map(m=>({...m})); rates = {...RATES};
  localStorage.setItem('wbc_version', DATA_VERSION);
  save(); saveRates();
}

function save(){ localStorage.setItem('wbc_models',JSON.stringify(models)); }
function saveRates(){ localStorage.setItem('wbc_rates',JSON.stringify(rates)); }

// ===== CÁLCULOS =====
function calcD(m){ return (m.chaturbate||0)*rates.chaturbate+(m.stripchat||0)*rates.stripchat+(m.camsoda||0)*rates.camsoda; }
function calcT(m){ return (m.chaturbate||0)+(m.stripchat||0)+(m.camsoda||0); }
function calcP(m){ return m.goal>0?(calcD(m)/m.goal)*100:0; }
function fmt(n){ return '$'+n.toLocaleString('en-US',{minimumFractionDigits:1,maximumFractionDigits:1}); }
function fmtP(n){ return n.toFixed(2)+'%'; }
function fmtT(n){ return n.toLocaleString('en-US'); }

function getShiftModels(){ return models.filter(m=>m.shift===currentShift); }
function getMonitors(){ return MONITORS[currentShift]||[]; }

function filtered(){
  let list = getShiftModels();
  const mon = document.getElementById('filterMonitor')?.value;
  const plat = document.getElementById('filterPlatform')?.value;
  const q = (document.getElementById('searchInput')?.value||'').toLowerCase();
  if(mon&&mon!=='all') list=list.filter(m=>m.monitor===mon);
  if(plat&&plat!=='all') list=list.filter(m=>(m[plat]||0)>0);
  if(q) list=list.filter(m=>m.nickname.toLowerCase().includes(q)||m.realName.toLowerCase().includes(q));
  return list;
}

// ===== NAVEGACIÓN =====
document.querySelectorAll('.nav-item').forEach(item=>{
  item.addEventListener('click',e=>{
    e.preventDefault();
    document.querySelectorAll('.nav-item').forEach(i=>i.classList.remove('active'));
    item.classList.add('active');
    const sec=item.dataset.section;
    document.querySelectorAll('.section').forEach(s=>s.classList.add('hidden'));
    document.getElementById('section-'+sec)?.classList.remove('hidden');
    document.getElementById('sectionTitle').textContent={dashboard:'Dashboard',models:'Modelos',calculator:'Calculadora',projections:'Proyecciones',commissions:'Comisiones',guide:'Guía',settings:'Configuración'}[sec]||sec;
    if(sec==='projections') renderProjections();
    if(sec==='commissions') renderCommissions();
    if(sec==='calculator') renderCalculator();
  });
});

document.getElementById('menuToggle').addEventListener('click',()=>{
  document.getElementById('sidebar').classList.toggle('open');
});
document.getElementById('sidebarOverlay')?.addEventListener('click',()=>{
  document.getElementById('sidebar').classList.remove('open');
});

// Shift & Period
const shiftSel = document.getElementById('shiftSelect');
const periodSel = document.getElementById('periodSelect');
shiftSel.value = currentShift;
periodSel.value = currentPeriod;
shiftSel.addEventListener('change',e=>{ currentShift=e.target.value; localStorage.setItem('wbc_shift',currentShift); updateMonitorFilter(); refresh(); });
periodSel.addEventListener('change',e=>{ currentPeriod=parseInt(e.target.value); localStorage.setItem('wbc_period',currentPeriod); refresh(); });

function updateMonitorFilter(){
  const sel = document.getElementById('filterMonitor');
  if(!sel) return;
  const mons = getMonitors();
  sel.innerHTML = '<option value="all">Todos los monitores</option>' + mons.map(m=>`<option value="${m}">${m}</option>`).join('');
}

// Date
document.getElementById('currentDate').textContent = new Date().toLocaleDateString('es-CO',{weekday:'long',year:'numeric',month:'long',day:'numeric'});

// ===== DASHBOARD =====
let platformChart, perfChart, projChart, goalsChart;

function renderDashboard(){
  const list = getShiftModels();
  const totalD = list.reduce((s,m)=>s+calcD(m),0);
  const totalT = list.reduce((s,m)=>s+calcT(m),0);
  const avgP = list.length ? list.reduce((s,m)=>s+calcP(m),0)/list.length : 0;
  const above = list.filter(m=>calcP(m)>=100).length;
  const top = list.length ? list.reduce((a,b)=>calcD(a)>calcD(b)?a:b) : null;

  document.getElementById('totalEarnings').textContent = fmt(totalD);
  document.getElementById('totalTokens').textContent = fmtT(totalT)+' tokens';
  document.getElementById('avgPerformance').textContent = fmtP(avgP);
  document.getElementById('modelsAboveGoal').textContent = above+' sobre meta';
  document.getElementById('topModelName').textContent = top?top.nickname:'—';
  document.getElementById('topModelEarnings').textContent = top?fmt(calcD(top)):'$0';
  document.getElementById('activeModels').textContent = list.length;
  document.getElementById('modelShiftInfo').textContent = 'Turno '+currentShift;

  // Días transcurridos en la quincena
  const daysElapsed = currentPeriod * 5;
  document.getElementById('daysInfo').textContent = `Día ${daysElapsed} de 15 — Período ${currentPeriod}/3`;

  // Monitor cards dinámicos
  const mons = getMonitors();
  const monContainer = document.getElementById('monitorCards');
  monContainer.innerHTML = '';
  const colors = [['purple','pink','dani'],['cyan','green','ramon']];
  mons.forEach((mon,i)=>{
    const ml = list.filter(m=>m.monitor===mon);
    const tot = ml.reduce((s,m)=>s+calcD(m),0);
    const goalTot = ml.reduce((s,m)=>s+m.goal,0);
    const rend = goalTot>0?(tot/goalTot)*100:0;
    const c = colors[i]||colors[0];
    const initial = mon.charAt(0);
    monContainer.innerHTML += `
      <div class="card monitor-card">
        <div class="monitor-header">
          <div class="monitor-avatar ${c[2]}">${initial}</div>
          <div><h3>${mon}</h3><span class="monitor-role">Monitor/a</span></div>
          <div class="monitor-badge" style="background:${rend>=100?'rgba(16,185,129,0.15)':'rgba(239,68,68,0.15)'};color:${rend>=100?'var(--green)':'var(--red)'}">${fmtP(rend)}</div>
        </div>
        <div class="monitor-stats">
          <div class="stat"><span class="stat-label">Total USD</span><span class="stat-value">${fmt(tot)}</span></div>
          <div class="stat"><span class="stat-label">Modelos</span><span class="stat-value">${ml.length}</span></div>
          <div class="stat"><span class="stat-label">Rendimiento</span><span class="stat-value">${fmtP(rend)}</span></div>
        </div>
        <div class="monitor-bar"><div class="bar-fill ${c[2]}-bar" style="width:${Math.min(rend,200)/2}%"></div></div>
      </div>`;
  });

  renderCharts(list);
}

// ===== COMISIONES =====
function calcCommission(monitor) {
  const list = getShiftModels().filter(m => m.monitor === monitor);
  const numModels = list.length;
  const totalUSD = list.reduce((s, m) => s + calcD(m), 0);
  const totalTokens = list.reduce((s, m) => s + calcT(m), 0);
  const R = COMMISSION_RULES;

  // Ajuste por 9 modelos
  const has9 = numModels >= 9;
  const adjustedTiers = COMMISSION_TIERS.map(t => ({
    ...t,
    facturacionUSD: has9 ? t.facturacionUSD + R.penalizacion9Modelos : t.facturacionUSD
  }));

  // Descuento por huecos (modelos faltantes vs capacidad base)
  const huecos = Math.max(0, R.capacidadBase - numModels);
  const descuentoHuecos = huecos * R.huecoDescuento;
  const facturacionEfectiva = Math.max(0, totalUSD - descuentoHuecos);

  // Buscar tier
  let tierIdx = -1;
  for (let i = adjustedTiers.length - 1; i >= 0; i--) {
    if (facturacionEfectiva >= adjustedTiers[i].facturacionUSD) { tierIdx = i; break; }
  }

  // Regla del 40%: si 1 modelo hace 40%+ del total, bajar un tier
  let penalidad40 = false;
  if (tierIdx >= 0 && totalUSD > 0) {
    const maxModel = Math.max(...list.map(m => calcD(m)));
    if (maxModel / totalUSD >= R.umbral40Porciento) {
      penalidad40 = true;
      tierIdx = Math.max(tierIdx - 1, -1);
    }
  }

  const tier = tierIdx >= 0 ? adjustedTiers[tierIdx] : null;
  const nextTier = tierIdx < adjustedTiers.length - 1 ? adjustedTiers[tierIdx + 1] : null;
  const faltaParaSiguiente = nextTier ? nextTier.facturacionUSD - facturacionEfectiva : 0;

  return { monitor, numModels, totalUSD, totalTokens, facturacionEfectiva, tier, nextTier, tierIdx, penalidad40, has9, huecos, descuentoHuecos, faltaParaSiguiente };
}

function fmtCOP(n) { return '$' + n.toLocaleString('es-CO'); }

function renderCommissions() {
  const mons = getMonitors();
  document.getElementById('commShift').textContent = currentShift.charAt(0).toUpperCase() + currentShift.slice(1);
  const container = document.getElementById('commissionCards');
  container.innerHTML = '';

  mons.forEach(mon => {
    const c = calcCommission(mon);
    const bonoText = c.tier ? fmtCOP(c.tier.bonoCOP) + ' COP' : 'Sin bono (bajo mínimo)';
    const bonoColor = c.tier ? 'var(--green)' : 'var(--red)';
    const nextText = c.nextTier ? `Faltan ${fmt(c.faltaParaSiguiente)} para ${fmtCOP(c.nextTier.bonoCOP)} COP` : 'Tier máximo alcanzado 🏆';

    container.innerHTML += `
      <div class="card commission-card">
        <h3 class="card-title"><i class="fas fa-user-tie"></i> ${mon}</h3>
        <div class="projection-stats">
          <div class="proj-item"><div class="proj-label">Facturación Actual</div><div class="proj-value" style="color:var(--gold)">${fmt(c.totalUSD)}</div><div class="proj-sub">${fmtT(c.totalTokens)} tokens</div></div>
          <div class="proj-item"><div class="proj-label">Facturación Efectiva</div><div class="proj-value">${fmt(c.facturacionEfectiva)}</div><div class="proj-sub">${c.huecos > 0 ? '⚠️ -' + fmt(c.descuentoHuecos) + ' por ' + c.huecos + ' hueco(s)' : '✅ Sin descuentos'}</div></div>
          <div class="proj-item"><div class="proj-label">Bono Actual</div><div class="proj-value" style="color:${bonoColor}">${bonoText}</div><div class="proj-sub">${c.penalidad40 ? '⚠️ Penalización 40% aplicada (bajó 1 tier)' : ''} ${c.has9 ? '⚠️ +$800 por 9 modelos' : ''}</div></div>
          <div class="proj-item"><div class="proj-label">Siguiente Nivel</div><div class="proj-value" style="font-size:1rem">${nextText}</div><div class="proj-sub">${c.numModels} modelos activas</div></div>
        </div>
      </div>`;
  });

  // Tabla de referencia
  const tbody = document.getElementById('commissionTableBody');
  tbody.innerHTML = '';
  // Usar el primer monitor como referencia para highlight
  const ref = mons.length ? calcCommission(mons[0]) : null;
  COMMISSION_TIERS.forEach((t, i) => {
    const active = ref && ref.tierIdx === i;
    const reached = ref && ref.facturacionEfectiva >= t.facturacionUSD;
    const promModelo = (t.facturacionUSD / 8).toFixed(1);
    tbody.innerHTML += `<tr style="${active ? 'background:rgba(124,58,237,0.15)' : ''}">
      <td style="font-weight:700;color:var(--gold)">${fmtCOP(t.bonoCOP)}</td>
      <td class="cell-usd">${fmt(t.facturacionUSD)}</td>
      <td>${fmtT(t.totalTokens)}</td>
      <td>${fmt(parseFloat(promModelo))}</td>
      <td>${active ? '<span class="cell-percent percent-high">◀ ACTUAL</span>' : reached ? '✅' : '—'}</td>
    </tr>`;
  });
}

function renderCharts(list){
  const cb=list.reduce((s,m)=>s+(m.chaturbate||0)*rates.chaturbate,0);
  const sc=list.reduce((s,m)=>s+(m.stripchat||0)*rates.stripchat,0);
  const cs=list.reduce((s,m)=>s+(m.camsoda||0)*rates.camsoda,0);
  const ctx1=document.getElementById('platformChart').getContext('2d');
  if(platformChart) platformChart.destroy();
  platformChart=new Chart(ctx1,{type:'doughnut',data:{labels:['Chaturbate','Stripchat','Camsoda'],datasets:[{data:[cb,sc,cs],backgroundColor:['#7c3aed','#ec4899','#06b6d4'],borderWidth:0,hoverOffset:8}]},options:{responsive:true,maintainAspectRatio:false,cutout:'65%',plugins:{legend:{position:'bottom',labels:{color:'#9090b0',padding:14,font:{family:'Inter'}}}}}});

  const sorted=[...list].sort((a,b)=>calcP(b)-calcP(a)).slice(0,10);
  const ctx2=document.getElementById('performanceChart').getContext('2d');
  if(perfChart) perfChart.destroy();
  perfChart=new Chart(ctx2,{type:'bar',data:{labels:sorted.map(m=>m.nickname),datasets:[{label:'%',data:sorted.map(m=>calcP(m)),backgroundColor:sorted.map(m=>calcP(m)>=100?'rgba(124,58,237,0.6)':'rgba(239,68,68,0.5)'),borderColor:sorted.map(m=>calcP(m)>=100?'#a855f7':'#ef4444'),borderWidth:1,borderRadius:6}]},options:{responsive:true,maintainAspectRatio:false,indexAxis:'y',scales:{x:{grid:{color:'rgba(255,255,255,0.04)'},ticks:{color:'#9090b0'}},y:{grid:{display:false},ticks:{color:'#f0f0f5',font:{size:11}}}},plugins:{legend:{display:false}}}});
}

// ===== TABLA =====
function renderTable(){
  const list = filtered();
  const tbody = document.getElementById('modelsTableBody');
  const tfoot = document.getElementById('modelsTableFoot');
  tbody.innerHTML='';
  list.forEach(m=>{
    const d=calcD(m), p=calcP(m);
    const cls=p>=100?'percent-high':p>=70?'percent-mid':'percent-low';
    const dotCls=getMonitors().indexOf(m.monitor)===0?'dot-dani':'dot-ramon';
    tbody.innerHTML+=`<tr>
      <td class="cell-nickname">${m.nickname}</td>
      <td><span class="cell-monitor"><span class="dot ${dotCls}"></span>${m.monitor}</span></td>
      <td>${m.realName}</td>
      <td class="cell-usd">${fmt(m.goal)}</td>
      <td class="cell-tokens">${m.chaturbate>0?fmtT(m.chaturbate)+' <small>('+fmt(m.chaturbate*rates.chaturbate)+')</small>':'—'}</td>
      <td class="cell-tokens">${m.stripchat>0?fmtT(m.stripchat)+' <small>('+fmt(m.stripchat*rates.stripchat)+')</small>':'—'}</td>
      <td class="cell-tokens">${m.camsoda>0?fmtT(m.camsoda)+' <small>('+fmt(m.camsoda*rates.camsoda)+')</small>':'—'}</td>
      <td class="cell-usd">${fmt(d)}</td>
      <td><span class="cell-percent ${cls}">${fmtP(p)}</span></td>
      <td class="cell-pda">${m.pda?'✅':'⬜'}</td>
      <td class="cell-actions">
        <button class="btn-icon" onclick="editModel(${m.id})"><i class="fas fa-pen"></i></button>
        <button class="btn-icon danger" onclick="deleteModel(${m.id})"><i class="fas fa-trash"></i></button>
      </td></tr>`;
  });
  const totalD=list.reduce((s,m)=>s+calcD(m),0);
  const totalG=list.reduce((s,m)=>s+m.goal,0);
  const totalP=totalG>0?(totalD/totalG)*100:0;
  tfoot.innerHTML=`<tr>
    <td colspan="4" style="text-align:right;font-weight:800">TOTAL</td>
    <td>${fmtT(list.reduce((s,m)=>s+(m.chaturbate||0),0))}</td>
    <td>${fmtT(list.reduce((s,m)=>s+(m.stripchat||0),0))}</td>
    <td>${fmtT(list.reduce((s,m)=>s+(m.camsoda||0),0))}</td>
    <td class="cell-usd">${fmt(totalD)}</td>
    <td><span class="cell-percent ${totalP>=100?'percent-high':'percent-low'}">${fmtP(totalP)} REND. NETO</span></td>
    <td></td><td></td></tr>`;
}

// ===== PROYECCIONES =====
function renderProjections(){
  const list=getShiftModels();
  const totalNow=list.reduce((s,m)=>s+calcD(m),0);
  const totalGoal=list.reduce((s,m)=>s+m.goal,0);
  const daysElapsed=currentPeriod*5;
  const dailyRate=daysElapsed>0?totalNow/daysElapsed:0;
  const proj15=dailyRate*15;
  const projVsGoal=totalGoal>0?(proj15/totalGoal)*100:0;
  const remaining=15-daysElapsed;
  const projFinal=totalNow+(dailyRate*remaining);

  document.getElementById('projectionStats').innerHTML=`
    <div class="proj-item"><div class="proj-label">Ingresos Actuales (Día ${daysElapsed})</div><div class="proj-value" style="color:var(--gold)">${fmt(totalNow)}</div><div class="proj-sub">Acumulado período ${currentPeriod}/3</div></div>
    <div class="proj-item"><div class="proj-label">Promedio Diario</div><div class="proj-value">${fmt(dailyRate)}</div><div class="proj-sub">Total ÷ ${daysElapsed} días</div></div>
    <div class="proj-item"><div class="proj-label">Proyección Quincenal (15 días)</div><div class="proj-value" style="color:var(--purple-light)">${fmt(proj15)}</div><div class="proj-sub">Promedio diario × 15</div></div>
    <div class="proj-item"><div class="proj-label">Proyección vs Meta Total</div><div class="proj-value" style="color:${projVsGoal>=100?'var(--green)':'var(--red)'}">${fmtP(projVsGoal)}</div><div class="proj-sub">Meta: ${fmt(totalGoal)} | Faltan ${remaining} días</div></div>
    <div class="proj-item"><div class="proj-label">Estimado al Cierre</div><div class="proj-value" style="color:var(--cyan)">${fmt(projFinal)}</div><div class="proj-sub">Actual + (promedio × ${remaining} días restantes)</div></div>
    <div class="proj-item"><div class="proj-label">Diferencia vs Meta</div><div class="proj-value" style="color:${projFinal>=totalGoal?'var(--green)':'var(--red)'}">${fmt(projFinal-totalGoal)}</div><div class="proj-sub">${projFinal>=totalGoal?'Superando meta ✅':'Por debajo de meta ⚠️'}</div></div>`;

  // Charts
  const ctx=document.getElementById('projectionChart').getContext('2d');
  if(projChart) projChart.destroy();
  const periods=[1,2,3];
  projChart=new Chart(ctx,{type:'line',data:{labels:periods.map(p=>'P'+p+' (Día '+p*5+')'),datasets:[
    {label:'Proyección',data:periods.map(p=>dailyRate*p*5),borderColor:'#a855f7',backgroundColor:'rgba(168,85,247,0.1)',fill:true,tension:0.3,borderWidth:2,pointRadius:5},
    {label:'Meta',data:periods.map(()=>totalGoal),borderColor:'rgba(245,158,11,0.5)',borderDash:[6,4],borderWidth:2,pointRadius:0,fill:false}
  ]},options:{responsive:true,maintainAspectRatio:false,scales:{x:{grid:{color:'rgba(255,255,255,0.04)'},ticks:{color:'#9090b0'}},y:{grid:{color:'rgba(255,255,255,0.04)'},ticks:{color:'#9090b0',callback:v=>'$'+v.toLocaleString()}}},plugins:{legend:{labels:{color:'#9090b0'}}}}});

  const ctx2=document.getElementById('goalsChart').getContext('2d');
  if(goalsChart) goalsChart.destroy();
  const sorted=[...list].sort((a,b)=>calcD(b)-calcD(a));
  goalsChart=new Chart(ctx2,{type:'bar',data:{labels:sorted.map(m=>m.nickname),datasets:[
    {label:'Meta USD',data:sorted.map(m=>m.goal),backgroundColor:'rgba(245,158,11,0.3)',borderColor:'#f59e0b',borderWidth:1,borderRadius:4},
    {label:'Actual USD',data:sorted.map(m=>calcD(m)),backgroundColor:'rgba(124,58,237,0.5)',borderColor:'#a855f7',borderWidth:1,borderRadius:4}
  ]},options:{responsive:true,maintainAspectRatio:false,scales:{x:{grid:{display:false},ticks:{color:'#f0f0f5',font:{size:10},maxRotation:45}},y:{grid:{color:'rgba(255,255,255,0.04)'},ticks:{color:'#9090b0',callback:v=>'$'+v.toLocaleString()}}},plugins:{legend:{labels:{color:'#9090b0'}}}}});
}

// ===== MODAL =====
const overlay=document.getElementById('modalOverlay');
function openModal(t){document.getElementById('modalTitle').textContent=t;overlay.classList.add('active');}
function closeModal(){overlay.classList.remove('active');document.getElementById('modelForm').reset();document.getElementById('editModelId').value='';}
document.getElementById('modalClose').addEventListener('click',closeModal);
document.getElementById('btnCancelModal').addEventListener('click',closeModal);
overlay.addEventListener('click',e=>{if(e.target===overlay)closeModal();});
document.getElementById('btnAddModel').addEventListener('click',()=>{
  // Set monitor options based on current shift
  const monSel=document.getElementById('inputMonitor');
  monSel.innerHTML=getMonitors().map(m=>`<option value="${m}">${m}</option>`).join('');
  openModal('Agregar Modelo');
});

window.editModel=function(id){
  const m=models.find(x=>x.id===id);if(!m)return;
  const monSel=document.getElementById('inputMonitor');
  monSel.innerHTML=getMonitors().map(mon=>`<option value="${mon}">${mon}</option>`).join('');
  document.getElementById('editModelId').value=m.id;
  document.getElementById('inputNickname').value=m.nickname;
  document.getElementById('inputRealName').value=m.realName;
  monSel.value=m.monitor;
  document.getElementById('inputGoal').value=m.goal;
  document.getElementById('inputChaturbate').value=m.chaturbate||0;
  document.getElementById('inputStripchat').value=m.stripchat||0;
  document.getElementById('inputCamsoda').value=m.camsoda||0;
  document.getElementById('inputObs').value=m.obs||'';
  document.getElementById('inputPDA').checked=m.pda;
  openModal('Editar Modelo');
};

window.deleteModel=function(id){if(!confirm('¿Eliminar este modelo?'))return;models=models.filter(m=>m.id!==id);save();refresh();};

document.getElementById('modelForm').addEventListener('submit',e=>{
  e.preventDefault();
  const editId=document.getElementById('editModelId').value;
  const data={
    nickname:document.getElementById('inputNickname').value.trim(),
    realName:document.getElementById('inputRealName').value.trim(),
    monitor:document.getElementById('inputMonitor').value,
    goal:parseFloat(document.getElementById('inputGoal').value)||0,
    chaturbate:parseInt(document.getElementById('inputChaturbate').value)||0,
    stripchat:parseInt(document.getElementById('inputStripchat').value)||0,
    camsoda:parseInt(document.getElementById('inputCamsoda').value)||0,
    obs:document.getElementById('inputObs').value.trim(),
    pda:document.getElementById('inputPDA').checked,
    shift:currentShift
  };
  if(editId){const idx=models.findIndex(m=>m.id===parseInt(editId));if(idx>=0)Object.assign(models[idx],data);}
  else{data.id=models.length?Math.max(...models.map(m=>m.id))+1:1;models.push(data);}
  save();closeModal();refresh();
});

// ===== FILTROS =====
['searchInput','filterMonitor','filterPlatform'].forEach(id=>{
  const el=document.getElementById(id);
  if(el){el.addEventListener('input',renderTable);el.addEventListener('change',renderTable);}
});

// ===== SETTINGS =====
document.getElementById('rateChaturbate').value=rates.chaturbate;
document.getElementById('rateStripchat').value=rates.stripchat;
document.getElementById('rateCamsoda').value=rates.camsoda;
document.getElementById('btnSaveRates').addEventListener('click',()=>{
  rates.chaturbate=parseFloat(document.getElementById('rateChaturbate').value)||0.05;
  rates.stripchat=parseFloat(document.getElementById('rateStripchat').value)||0.05;
  rates.camsoda=parseFloat(document.getElementById('rateCamsoda').value)||0.04;
  saveRates();refresh();alert('✅ Tasas guardadas');
});

// ===== EXPORT =====
function exportCSV(){
  const list=getShiftModels();
  let csv='Nickname,Monitor,Modelo,Meta USD,Chaturbate Tk,Stripchat Tk,Camsoda Tk,Total USD,Porcentaje,PDA\n';
  list.forEach(m=>{csv+=`"${m.nickname}","${m.monitor}","${m.realName}",${m.goal},${m.chaturbate||0},${m.stripchat||0},${m.camsoda||0},${calcD(m).toFixed(1)},${calcP(m).toFixed(2)}%,${m.pda?'Sí':'No'}\n`;});
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv'}));
  a.download=`WBC_Q${QUINCENA.numero}_${currentShift}_${new Date().toISOString().slice(0,10)}.csv`;a.click();
}
document.getElementById('btnExport').addEventListener('click',exportCSV);
document.getElementById('btnExportCSV')?.addEventListener('click',exportCSV);
document.getElementById('btnExportJSON')?.addEventListener('click',()=>{
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({models,rates,quincena:QUINCENA},null,2)],{type:'application/json'}));
  a.download=`WBC_Backup_${new Date().toISOString().slice(0,10)}.json`;a.click();
});
document.getElementById('btnImportJSON')?.addEventListener('change',e=>{
  const f=e.target.files[0];if(!f)return;const r=new FileReader();
  r.onload=ev=>{try{const d=JSON.parse(ev.target.result);if(d.models){models=d.models;save();}if(d.rates){rates=d.rates;saveRates();}refresh();alert('✅ Importado');}catch{alert('❌ Error');}};
  r.readAsText(f);
});
document.getElementById('btnClearData')?.addEventListener('click',()=>{
  if(!confirm('¿Borrar TODOS los datos y restaurar originales?'))return;
  localStorage.clear();models=SAMPLE.map(m=>({...m}));rates={...RATES};save();saveRates();refresh();alert('✅ Restaurado');
});

// ===== CALCULADORA MANUAL =====
function renderCalculator(){
  const container = document.getElementById('manualCalcCards');
  if(!container) return;
  const mons = getMonitors();
  const list = getShiftModels();

  container.innerHTML = '';
  mons.forEach(mon => {
    const ml = list.filter(m => m.monitor === mon);
    let modelRows = ml.map(m => `
      <div class="calc-grid-row">
        <span class="calc-nick" title="${m.nickname}">${m.nickname}</span>
        <input type="number" class="calc-input" data-monitor="${mon}" data-id="${m.id}" data-platform="chaturbate" value="${m.chaturbate||0}" placeholder="CB">
        <input type="number" class="calc-input" data-monitor="${mon}" data-id="${m.id}" data-platform="stripchat" value="${m.stripchat||0}" placeholder="SC">
        <input type="number" class="calc-input" data-monitor="${mon}" data-id="${m.id}" data-platform="camsoda" value="${m.camsoda||0}" placeholder="CS">
        <span class="calc-usd calc-usd-cell" data-id="${m.id}">$0</span>
      </div>`).join('');

    container.innerHTML += `
      <div class="card manual-card">
        <h3 class="card-title"><i class="fas fa-user-tie"></i> ${mon} — Cálculo Manual</h3>
        <div class="calc-grid-header">
          <span>Modelo</span><span>CB</span><span>SC</span><span>CS</span><span>USD</span>
        </div>
        ${modelRows}
        <div class="manual-result" id="calcResult-${mon.replace(/[^a-zA-Z]/g,'')}">
          <div class="result-row"><span>Total USD estimado:</span><span class="calc-total-usd">$0</span></div>
          <div class="result-row"><span>Total Tokens:</span><span class="calc-total-tk">0</span></div>
          <div class="result-row"><span>Bono estimado:</span><span class="calc-bono">—</span></div>
          <div class="result-row"><span>Siguiente nivel:</span><span class="calc-next">—</span></div>
        </div>
      </div>`;
  });

  container.querySelectorAll('.calc-input').forEach(input => {
    input.addEventListener('input', () => updateCalcResult(input.dataset.monitor));
  });
  mons.forEach(mon => updateCalcResult(mon));
}

function updateCalcResult(monitor) {
  const container = document.getElementById('manualCalcCards');
  const inputs = container.querySelectorAll(`.calc-input[data-monitor="${monitor}"]`);
  const resultDiv = document.getElementById('calcResult-' + monitor.replace(/[^a-zA-Z]/g,''));
  if(!resultDiv) return;

  // Calculate per model
  const modelTotals = {};
  inputs.forEach(inp => {
    const id = inp.dataset.id;
    const plat = inp.dataset.platform;
    if(!modelTotals[id]) modelTotals[id] = { chaturbate:0, stripchat:0, camsoda:0 };
    modelTotals[id][plat] = parseInt(inp.value) || 0;
  });

  let totalUSD = 0;
  let totalTk = 0;
  Object.keys(modelTotals).forEach(id => {
    const m = modelTotals[id];
    const usd = m.chaturbate * rates.chaturbate + m.stripchat * rates.stripchat + m.camsoda * rates.camsoda;
    totalUSD += usd;
    totalTk += m.chaturbate + m.stripchat + m.camsoda;
    const cell = container.querySelector(`.calc-usd-cell[data-id="${id}"]`);
    if(cell) cell.textContent = fmt(usd);
  });

  // Commission calc
  const numModels = Object.keys(modelTotals).length;
  const huecos = Math.max(0, COMMISSION_RULES.capacidadBase - numModels);
  const facEfectiva = Math.max(0, totalUSD - huecos * COMMISSION_RULES.huecoDescuento);
  const has9 = numModels >= 9;
  let tierIdx = -1;
  for(let i = COMMISSION_TIERS.length-1; i>=0; i--){
    const req = has9 ? COMMISSION_TIERS[i].facturacionUSD + COMMISSION_RULES.penalizacion9Modelos : COMMISSION_TIERS[i].facturacionUSD;
    if(facEfectiva >= req){ tierIdx = i; break; }
  }

  resultDiv.querySelector('.calc-total-usd').textContent = fmt(totalUSD);
  resultDiv.querySelector('.calc-total-tk').textContent = fmtT(totalTk);
  resultDiv.querySelector('.calc-bono').textContent = tierIdx >= 0 ? fmtCOP(COMMISSION_TIERS[tierIdx].bonoCOP) + ' COP' : 'Sin bono aún';
  resultDiv.querySelector('.calc-bono').style.color = tierIdx >= 0 ? 'var(--green)' : 'var(--red)';
  const nextTier = tierIdx < COMMISSION_TIERS.length - 1 ? COMMISSION_TIERS[tierIdx+1] : null;
  const nextReq = nextTier ? (has9 ? nextTier.facturacionUSD + COMMISSION_RULES.penalizacion9Modelos : nextTier.facturacionUSD) : 0;
  resultDiv.querySelector('.calc-next').textContent = nextTier ? `Faltan ${fmt(nextReq - facEfectiva)} para ${fmtCOP(nextTier.bonoCOP)} COP` : '🏆 Tier máximo';
}

// ===== INIT =====
function refresh(){renderDashboard();renderTable();renderCommissions();renderCalculator();}
updateMonitorFilter();
refresh();

