/**
 * tools.js — Herramientas de regulación y ventanita
 *
 * Gestiona:
 *  - La animación de apertura de la puerta/ventana
 *  - La cuadrícula de herramientas seleccionables
 *  - La guía de respiración animada
 *  - El termómetro "después" para reevaluar
 */

'use strict';

const Tools = (() => {

  const TOOLS_DATA = [
    { emoji: '🌬️', label: 'Respirar despacio',    key: 'respirar',  hasGuide: true  },
    { emoji: '🧸', label: 'Abrazar un peluche',   key: 'peluche',   hasGuide: false },
    { emoji: '🎨', label: 'Dibujar o colorear',   key: 'dibujar',   hasGuide: false },
    { emoji: '💬', label: 'Hablar con un adulto',  key: 'adulto',    hasGuide: false },
    { emoji: '🛋️', label: 'Descansar un momento', key: 'descansar', hasGuide: false },
    { emoji: '🎵', label: 'Escuchar música',       key: 'musica',    hasGuide: false },
    { emoji: '🚶', label: 'Caminar o moverme',     key: 'caminar',   hasGuide: false },
    { emoji: '💧', label: 'Tomar agua',            key: 'agua',      hasGuide: false },
  ];

  const TOOL_FEEDBACK = {
    respirar:  '🌬️ Respira despacio con el círculo. No hay prisa.',
    peluche:   '🧸 Un abrazo es siempre bienvenido. Siente el calor.',
    dibujar:   '🎨 El dibujo puede ser un lugar seguro para tus emociones.',
    adulto:    '💬 Pedir compañía es valiente. Hay adultos que te escuchan.',
    descansar: '🛋️ Descansar no es rendirse. Tu cuerpo lo necesita.',
    musica:    '🎵 La música puede acompañar tu emoción o calmarte poco a poco.',
    caminar:   '🚶 Mover el cuerpo ayuda a que la energía fluya.',
    agua:      '💧 Beber agua despacio puede calmar tu sistema nervioso.',
  };

  let breathingInterval = null;
  let breathPhase = 0;
  const breathPhases = [
    { text: 'Inhala…',   instruction: 'Toma aire despacio por la nariz (4 segundos)', duration: 4000 },
    { text: 'Aguanta',   instruction: 'Mantén el aire suavemente (4 segundos)',        duration: 4000 },
    { text: 'Exhala…',   instruction: 'Suelta el aire por la boca despacio (6 seg.)',  duration: 6000 },
    { text: 'Descansa',  instruction: 'Pausa breve antes de la siguiente (2 seg.)',    duration: 2000 },
  ];

  // After-slider for re-evaluation
  let afterSlider = null;
  let afterNumberEl = null;

  function buildToolsGrid() {
    const grid = document.getElementById('tools-grid');
    if (!grid) return;
    grid.innerHTML = '';

    TOOLS_DATA.forEach(tool => {
      const btn = document.createElement('button');
      btn.className = 'tool-card';
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('data-key', tool.key);
      btn.setAttribute('aria-label', tool.label);
      btn.innerHTML = `<span class="tool-emoji" aria-hidden="true">${tool.emoji}</span>${tool.label}`;

      btn.addEventListener('click', () => selectTool(btn, tool));
      grid.appendChild(btn);
    });
  }

  function selectTool(btn, tool) {
    AudioSystem.playUI(540, 0.18);
    // Deselect all
    document.querySelectorAll('.tool-card').forEach(b => {
      b.setAttribute('aria-pressed', 'false');
    });
    btn.setAttribute('aria-pressed', 'true');

    // Save to state
    AppState.set('selectedTool', { emoji: tool.emoji, label: tool.label });

    // Feedback text
    const fb = document.getElementById('tool-feedback');
    if (fb) fb.textContent = TOOL_FEEDBACK[tool.key] || '';

    // Show / hide breathing guide
    const guide = document.getElementById('breathing-guide');
    if (guide) {
      if (tool.hasGuide) {
        guide.classList.remove('hidden');
        startBreathingGuide();
      } else {
        guide.classList.add('hidden');
        stopBreathingGuide();
      }
    }

    // Ensure re-measure section visible
    const reSect = document.getElementById('re-measure-section');
    if (reSect) reSect.style.opacity = '1';
  }

  function startBreathingGuide() {
    stopBreathingGuide();
    breathPhase = 0;
    runBreathPhase();
  }

  function runBreathPhase() {
    const textEl  = document.getElementById('breath-text');
    const instrEl = document.getElementById('breath-instruction');
    const phase   = breathPhases[breathPhase % breathPhases.length];

    if (textEl)  textEl.textContent  = phase.text;
    if (instrEl) instrEl.textContent = phase.instruction;

    AudioSystem.playUI(breathPhase % 4 === 0 ? 440 : 330, 0.12);

    breathingInterval = setTimeout(() => {
      breathPhase++;
      runBreathPhase();
    }, phase.duration);
  }

  function stopBreathingGuide() {
    if (breathingInterval) {
      clearTimeout(breathingInterval);
      breathingInterval = null;
    }
  }

  // Window (door) open/close
  function initDoor() {
    const door = document.getElementById('window-door');
    const toolsContent = document.getElementById('tools-content');
    const doorLabel = door?.querySelector('.door-label');

    if (!door || !toolsContent) return;

    const openDoor = () => {
      const isOpen = door.getAttribute('aria-expanded') === 'true';
      if (!isOpen) {
        door.setAttribute('aria-expanded', 'true');
        if (doorLabel) doorLabel.textContent = 'Toca para cerrar 🚪';
        toolsContent.classList.remove('hidden');
        AudioSystem.playUI(650, 0.20);
        // Animate in
        toolsContent.style.opacity = '0';
        requestAnimationFrame(() => {
          toolsContent.style.transition = 'opacity .4s';
          toolsContent.style.opacity = '1';
        });
      } else {
        door.setAttribute('aria-expanded', 'false');
        if (doorLabel) doorLabel.textContent = 'Toca para abrir 🚪';
        toolsContent.classList.add('hidden');
        AudioSystem.playUI(400, 0.12);
        stopBreathingGuide();
      }
    };

    door.addEventListener('click', openDoor);
    door.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDoor(); }
    });

    // Stop breathing button
    const stopBtn = document.getElementById('btn-stop-breathing');
    if (stopBtn) {
      stopBtn.addEventListener('click', () => {
        stopBreathingGuide();
        const guide = document.getElementById('breathing-guide');
        if (guide) guide.classList.add('hidden');
        AudioSystem.playSuccess();
      });
    }
  }

  // After-slider
  function initAfterSlider() {
    afterSlider   = document.getElementById('after-slider');
    afterNumberEl = document.getElementById('after-number');

    if (afterSlider) {
      afterSlider.addEventListener('input', () => {
        const v = parseInt(afterSlider.value, 10);
        if (afterNumberEl) afterNumberEl.textContent = v;
        afterSlider.setAttribute('aria-valuetext', `${v} de 10`);
        AppState.set('levelAfter', v);
        AudioSystem.playUI(300 + v * 40, 0.05);
      });
      // Initialize with same as before value
      const before = AppState.get('levelBefore') ?? 5;
      afterSlider.value = before;
      if (afterNumberEl) afterNumberEl.textContent = before;
      AppState.set('levelAfter', before);
    }
  }

  function syncAfterSlider() {
    const before = AppState.get('levelBefore') ?? 5;
    if (afterSlider) afterSlider.value = before;
    if (afterNumberEl) afterNumberEl.textContent = before;
    AppState.set('levelAfter', before);
  }

  function init() {
    buildToolsGrid();
    initDoor();
    initAfterSlider();
  }

  function reset() {
    stopBreathingGuide();
    document.querySelectorAll('.tool-card').forEach(b => b.setAttribute('aria-pressed', 'false'));
    const fb = document.getElementById('tool-feedback');
    if (fb) fb.textContent = '';
    const guide = document.getElementById('breathing-guide');
    if (guide) guide.classList.add('hidden');
    const door = document.getElementById('window-door');
    if (door) door.setAttribute('aria-expanded', 'false');
    const toolsContent = document.getElementById('tools-content');
    if (toolsContent) toolsContent.classList.add('hidden');
    const doorLabel = door?.querySelector('.door-label');
    if (doorLabel) doorLabel.textContent = 'Toca para abrir 🚪';
    syncAfterSlider();
  }

  return { init, reset, syncAfterSlider, stopBreathingGuide };
})();

window.Tools = Tools;
