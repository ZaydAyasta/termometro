/**
 * adult.js — Panel para adultos/profesionales
 *
 * Contiene dos visualizaciones independientes:
 *
 * A. Escala de Hawkins (Power vs. Force, 1995)
 *    — Identificada como marco espiritual/filosófico, NO validación clínica.
 *    — Valores y nombres verificados contra fuente primaria: Hawkins, D.R.
 *      "Power vs. Force". Hay House, 1995. ISBN 978-1-4019-4609-0.
 *
 * B. Modelo bidimensional de experiencia emocional (propuesto por la profesional)
 *    — Eje X: duración | Eje Y: intensidad | Origen (0,0): tranquilidad
 *    — Pendiente de validación empírica. Uso psicoeducativo.
 *
 * NOTA: NO confundir los niveles de Hawkins con:
 *   - Niveles médicos de conciencia (Glasgow Coma Scale, AVPU)
 *   - Escala de conciencia de bienestar de la OMS
 */

'use strict';

const AdultPanel = (() => {

  // ── A. HAWKINS DATA ──────────────────────────────────────────
  // Fuente: Hawkins, D.R. Power vs. Force (1995).
  // Los valores numéricos son parte de la propuesta del autor.
  const HAWKINS_LEVELS = [
    { level: 20,   emotion: 'Vergüenza',     description: 'Humillación, autodestrucción',         color: '#1a1a2e' },
    { level: 30,   emotion: 'Culpa',         description: 'Victimismo, rencor hacia uno mismo',    color: '#16213e' },
    { level: 50,   emotion: 'Apatía',        description: 'Desesperanza, abandono',                color: '#2c3e50' },
    { level: 75,   emotion: 'Pena / Duelo',  description: 'Tristeza, pérdida, depresión',          color: '#34495e' },
    { level: 100,  emotion: 'Miedo',         description: 'Ansiedad, retraimiento',                color: '#6c5ce7' },
    { level: 125,  emotion: 'Deseo',         description: 'Anhelo, adicción, escasez',             color: '#e17055' },
    { level: 150,  emotion: 'Ira',           description: 'Odio, agresividad, resentimiento',      color: '#d63031' },
    { level: 175,  emotion: 'Orgullo',       description: 'Desdén, negación, arrogancia',          color: '#e84393' },
    { level: 200,  emotion: 'Coraje',        description: 'Afirmación, productividad (umbral)',     color: '#f39c12' },
    { level: 250,  emotion: 'Neutralidad',   description: 'Confianza, no condicionado',            color: '#95a5a6' },
    { level: 310,  emotion: 'Disposición',   description: 'Optimismo, intención, bondad',          color: '#27ae60' },
    { level: 350,  emotion: 'Aceptación',    description: 'Perdón, armonía, transformación',       color: '#2ecc71' },
    { level: 400,  emotion: 'Razón',         description: 'Comprensión, significado, abstracción', color: '#3498db' },
    { level: 500,  emotion: 'Amor',          description: 'Reverencia, incondicionalidad, unidad', color: '#e74c3c' },
    { level: 540,  emotion: 'Alegría',       description: 'Serenidad, compasión',                  color: '#f1c40f' },
    { level: 600,  emotion: 'Paz',           description: 'Bienaventuranza, perfección',           color: '#1abc9c' },
    { level: 700,  emotion: 'Iluminación',   description: 'Inefable, pura conciencia',             color: '#ecf0f1' },
    { level: 1000, emotion: 'Iluminación suprema', description: 'Budas, Krishnas, Jesús (según Hawkins)', color: '#ffeaa7' },
  ];

  function buildHawkinsTable() {
    const tbody = document.getElementById('hawkins-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    HAWKINS_LEVELS.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${row.level}</strong></td>
        <td>${row.emotion}</td>
        <td>${row.description}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function drawHawkinsChart() {
    const canvas = document.getElementById('hawkins-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const MARGIN = { top: 30, right: 20, bottom: 60, left: 80 };
    const chartW = W - MARGIN.left - MARGIN.right;
    const chartH = H - MARGIN.top - MARGIN.bottom;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#fafbfe';
    ctx.fillRect(0, 0, W, H);

    // Title
    ctx.fillStyle = '#19305a';
    ctx.font = 'bold 15px system-ui,Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Escala de Hawkins (propuesta espiritual — no escala clínica)', W / 2, 20);

    // Axis
    ctx.strokeStyle = '#c9d5e9';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(MARGIN.left, MARGIN.top);
    ctx.lineTo(MARGIN.left, MARGIN.top + chartH);
    ctx.lineTo(MARGIN.left + chartW, MARGIN.top + chartH);
    ctx.stroke();

    // Y axis label
    ctx.save();
    ctx.translate(18, MARGIN.top + chartH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#557';
    ctx.font = '13px system-ui,Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Nivel de calibración (Hawkins)', 0, 0);
    ctx.restore();

    // X axis label
    ctx.fillStyle = '#557';
    ctx.font = '13px system-ui,Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Emoción / Estado', MARGIN.left + chartW / 2, H - 8);

    const maxLevel = 1000;
    const scaleY = v => MARGIN.top + chartH - (v / maxLevel) * chartH;
    const barW = Math.floor(chartW / HAWKINS_LEVELS.length) - 4;

    // Critical threshold line at 200
    const lineY = scaleY(200);
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = '#f39c12';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(MARGIN.left, lineY);
    ctx.lineTo(MARGIN.left + chartW, lineY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#c9900a';
    ctx.font = 'bold 12px system-ui,Arial';
    ctx.textAlign = 'left';
    ctx.fillText('→ Umbral (200: Coraje)', MARGIN.left + 4, lineY - 5);

    HAWKINS_LEVELS.forEach((row, i) => {
      const x = MARGIN.left + i * (barW + 4) + 2;
      const barH = (row.level / maxLevel) * chartH;
      const y = MARGIN.top + chartH - barH;

      // Bar
      ctx.fillStyle = row.color;
      ctx.beginPath();
      ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
      ctx.fill();

      // Level label on top
      ctx.fillStyle = '#19305a';
      ctx.font = 'bold 10px system-ui,Arial';
      ctx.textAlign = 'center';
      ctx.fillText(row.level, x + barW / 2, y - 3);

      // Rotate label at bottom
      ctx.save();
      ctx.translate(x + barW / 2, MARGIN.top + chartH + 8);
      ctx.rotate(-Math.PI / 4);
      ctx.fillStyle = '#334';
      ctx.font = '11px system-ui,Arial';
      ctx.textAlign = 'right';
      ctx.fillText(row.emotion, 0, 0);
      ctx.restore();
    });
  }

  // ── B. MODELO BIDIMENSIONAL ──────────────────────────────────
  // Trayectorias ilustrativas

  const TRAJECTORIES = {
    brief: {
      label: 'Emoción intensa y breve',
      color: '#e74c3c',
      points: [[0,0], [0.05, 8], [0.15, 9], [0.25, 5], [0.40, 2], [0.55, 0.5], [0.70, 0]],
      note: 'Ej.: susto o sorpresa. Sube rápido y se disuelve pronto.',
    },
    persistent: {
      label: 'Emoción moderada y persistente',
      color: '#3498db',
      points: [[0,0], [0.10, 4], [0.30, 5], [0.50, 4.5], [0.70, 4], [0.90, 3], [1.00, 2]],
      note: 'Ej.: tristeza o preocupación que acompaña durante horas.',
    },
    supported: {
      label: 'Disminuye con apoyo o herramienta',
      color: '#27ae60',
      points: [[0,0], [0.10, 7], [0.25, 8], [0.35, 6], [0.50, 4], [0.65, 2], [0.80, 1], [1.00, 0]],
      note: 'Ej.: enojo que se calma al respirar o hablar con alguien.',
    },
    aware: {
      label: 'Intensidad alta con plena conciencia',
      color: '#9b59b6',
      points: [[0,0], [0.10, 8], [0.30, 9], [0.50, 8], [0.70, 7], [0.90, 5], [1.00, 3]],
      note: 'Una emoción puede ser intensa Y experimentarse con atención y autorregulación.',
      awareness: true,
    },
  };

  function drawModelChart(trajectoryKey) {
    const canvas = document.getElementById('model-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const MARGIN = { top: 40, right: 40, bottom: 70, left: 70 };
    const chartW = W - MARGIN.left - MARGIN.right;
    const chartH = H - MARGIN.top - MARGIN.bottom;

    ctx.clearRect(0, 0, W, H);

    // Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#fff8ff');
    bgGrad.addColorStop(1, '#f0f8ff');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Title
    ctx.fillStyle = '#19305a';
    ctx.font = 'bold 15px system-ui,Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Modelo bidimensional de experiencia emocional', W / 2, 22);

    // Grid lines
    ctx.strokeStyle = '#e0e8f0';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 10; i++) {
      const y = MARGIN.top + chartH - (i / 10) * chartH;
      ctx.beginPath();
      ctx.moveTo(MARGIN.left, y);
      ctx.lineTo(MARGIN.left + chartW, y);
      ctx.stroke();
    }
    for (let i = 1; i <= 10; i++) {
      const x = MARGIN.left + (i / 10) * chartW;
      ctx.beginPath();
      ctx.moveTo(x, MARGIN.top);
      ctx.lineTo(x, MARGIN.top + chartH);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#19305a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(MARGIN.left, MARGIN.top);
    ctx.lineTo(MARGIN.left, MARGIN.top + chartH);
    ctx.lineTo(MARGIN.left + chartW, MARGIN.top + chartH);
    ctx.stroke();

    // Arrow heads
    ctx.fillStyle = '#19305a';
    // Y arrow
    ctx.beginPath();
    ctx.moveTo(MARGIN.left, MARGIN.top);
    ctx.lineTo(MARGIN.left - 6, MARGIN.top + 12);
    ctx.lineTo(MARGIN.left + 6, MARGIN.top + 12);
    ctx.fill();
    // X arrow
    ctx.beginPath();
    ctx.moveTo(MARGIN.left + chartW, MARGIN.top + chartH);
    ctx.lineTo(MARGIN.left + chartW - 12, MARGIN.top + chartH - 6);
    ctx.lineTo(MARGIN.left + chartW - 12, MARGIN.top + chartH + 6);
    ctx.fill();

    // Axis labels
    ctx.fillStyle = '#334';
    ctx.font = 'bold 14px system-ui,Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Duración →', MARGIN.left + chartW / 2, H - 10);

    ctx.save();
    ctx.translate(18, MARGIN.top + chartH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('↑ Intensidad', 0, 0);
    ctx.restore();

    // Y axis ticks
    for (let i = 0; i <= 10; i++) {
      const y = MARGIN.top + chartH - (i / 10) * chartH;
      ctx.fillStyle = '#667';
      ctx.font = '12px system-ui,Arial';
      ctx.textAlign = 'right';
      ctx.fillText(i, MARGIN.left - 8, y + 4);
    }

    // Origin label
    ctx.fillStyle = '#27ae60';
    ctx.font = 'bold 12px system-ui,Arial';
    ctx.textAlign = 'left';
    ctx.fillText('(0,0) Tranquilidad', MARGIN.left + 6, MARGIN.top + chartH - 8);

    // Draw all trajectories dimmed, selected one highlighted
    const keys = Object.keys(TRAJECTORIES);
    keys.forEach(key => {
      const traj = TRAJECTORIES[key];
      const isSelected = key === trajectoryKey;
      drawTrajectory(ctx, traj, MARGIN, chartW, chartH, isSelected);
    });

    // Legend update
    updateLegend(trajectoryKey);

    // Note box
    const traj = TRAJECTORIES[trajectoryKey];
    if (traj) {
      ctx.fillStyle = 'rgba(255,255,255,.85)';
      ctx.roundRect(MARGIN.left + 10, MARGIN.top + 10, chartW - 20, 44, 8);
      ctx.fill();
      ctx.fillStyle = traj.color;
      ctx.font = '13px system-ui,Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`📌 ${traj.note}`, MARGIN.left + 18, MARGIN.top + 28);
      if (traj.awareness) {
        ctx.fillStyle = '#6c3483';
        ctx.font = 'bold 12px system-ui,Arial';
        ctx.fillText('★ Conciencia emocional ≠ ausencia de intensidad', MARGIN.left + 18, MARGIN.top + 48);
      }
    }
  }

  function drawTrajectory(ctx, traj, MARGIN, chartW, chartH, highlighted) {
    const pts = traj.points.map(([x, y]) => ({
      px: MARGIN.left + x * chartW,
      py: MARGIN.top + chartH - (y / 10) * chartH,
    }));

    ctx.strokeStyle = traj.color;
    ctx.lineWidth = highlighted ? 3.5 : 1.5;
    ctx.globalAlpha = highlighted ? 1 : 0.22;
    ctx.setLineDash(highlighted ? [] : [6, 4]);
    ctx.beginPath();
    pts.forEach((pt, i) => {
      if (i === 0) ctx.moveTo(pt.px, pt.py);
      else ctx.lineTo(pt.px, pt.py);
    });
    ctx.stroke();

    if (highlighted) {
      pts.forEach(pt => {
        ctx.fillStyle = traj.color;
        ctx.beginPath();
        ctx.arc(pt.px, pt.py, 5, 0, Math.PI * 2);
        ctx.fill();
      });
      // End arrow
      const last = pts[pts.length - 1];
      const prev = pts[pts.length - 2];
      const angle = Math.atan2(last.py - prev.py, last.px - prev.px);
      ctx.beginPath();
      ctx.moveTo(last.px, last.py);
      ctx.lineTo(last.px - 12 * Math.cos(angle - 0.4), last.py - 12 * Math.sin(angle - 0.4));
      ctx.lineTo(last.px - 12 * Math.cos(angle + 0.4), last.py - 12 * Math.sin(angle + 0.4));
      ctx.closePath();
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
  }

  function updateLegend(activeKey) {
    const legend = document.getElementById('model-legend');
    if (!legend) return;
    legend.innerHTML = '';
    Object.entries(TRAJECTORIES).forEach(([key, traj]) => {
      const item = document.createElement('div');
      item.className = 'legend-item';
      item.style.opacity = key === activeKey ? '1' : '0.5';
      item.innerHTML = `
        <div class="legend-swatch" style="background:${traj.color};width:28px;height:4px;border-radius:2px"></div>
        <span>${traj.label}</span>
      `;
      legend.appendChild(item);
    });
  }

  // Export model canvas as PNG
  function exportModelPNG() {
    const canvas = document.getElementById('model-canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'modelo-emocional.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  // Tabs
  function initTabs() {
    const tabs = document.querySelectorAll('.adult-tab');
    const panels = document.querySelectorAll('.adult-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => { t.setAttribute('aria-selected', 'false'); t.classList.remove('active'); });
        panels.forEach(p => p.classList.add('hidden'));

        tab.setAttribute('aria-selected', 'true');
        tab.classList.add('active');
        const panelId = tab.getAttribute('aria-controls');
        const panel = document.getElementById(panelId);
        if (panel) panel.classList.remove('hidden');

        AudioSystem.playUI(480, 0.10);
      });
    });
  }

  function init() {
    initTabs();
    buildHawkinsTable();
    drawHawkinsChart();
    drawModelChart('brief');

    const selector = document.getElementById('model-trajectory');
    if (selector) {
      selector.addEventListener('change', () => {
        drawModelChart(selector.value);
        AudioSystem.playUI(440, 0.10);
      });
    }

    const exportBtn = document.getElementById('btn-model-export');
    if (exportBtn) exportBtn.addEventListener('click', exportModelPNG);
  }

  return { init };
})();

window.AdultPanel = AdultPanel;
