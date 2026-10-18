/**
 * app.js — Controlador principal de la aplicación
 *
 * Gestiona:
 *  - Navegación entre pantallas
 *  - Flujo del niño (5 pantallas)
 *  - Controles de sonido globales
 *  - Emociones (predefinidas + personalizadas)
 *  - Sensaciones corporales
 *  - Pantalla de resumen
 *  - Modal de reinicio
 */

'use strict';

// ── Datos de emociones ──────────────────────────────────────────
const EMOTIONS = [
  { key: 'enojo',    emoji: '😠', label: 'Enojo',       bg: '#fff0ef' },
  { key: 'alegria',  emoji: '😄', label: 'Alegría',      bg: '#fffbea' },
  { key: 'tristeza', emoji: '😢', label: 'Tristeza',     bg: '#eef5fc' },
  { key: 'miedo',    emoji: '😨', label: 'Miedo',        bg: '#f3eefb' },
  { key: 'nervios',  emoji: '😬', label: 'Nervios',      bg: '#fff6e9' },
  { key: 'calma',    emoji: '😊', label: 'Tranquilidad', bg: '#edfaf2' },
];

// ── Sensaciones corporales ─────────────────────────────────────
const BODY_SENSATIONS = [
  { emoji: '💓', label: 'Corazón rápido',     key: 'heart' },
  { emoji: '🌬️', label: 'Respiración rápida', key: 'breath' },
  { emoji: '✊', label: 'Manos tensas',        key: 'hands' },
  { emoji: '🦋', label: 'Barriga revuelta',    key: 'belly' },
  { emoji: '😢', label: 'Ganas de llorar',     key: 'cry' },
  { emoji: '🔥', label: 'Calor en el cuerpo', key: 'heat' },
  { emoji: '🤯', label: 'Cabeza cargada',      key: 'head' },
  { emoji: '😴', label: 'Cansancio',           key: 'tired' },
  { emoji: '🥶', label: 'Frío o escalofríos',  key: 'cold' },
  { emoji: '🫀', label: 'Tensión muscular',     key: 'tension' },
];

// ── Summary messages ───────────────────────────────────────────
function getSummaryMessage(before, after, tool) {
  const diff = before - after;
  if (!tool) {
    return '🌟 Reconocer lo que sientes es el primer paso. ¡Lo hiciste!';
  }
  if (diff >= 3) {
    return `🎉 ¡Usar "${tool.label}" te ayudó mucho! Cada nivel que baja es un logro.`;
  } else if (diff > 0) {
    return `💚 Bajaste un poco. Está bien. Los cambios pequeños también cuentan.`;
  } else if (diff === 0) {
    return `🤍 La emoción sigue igual, y eso también está bien. Nadie te pide llegar a cero.`;
  } else {
    return `💙 A veces al notar más, la emoción parece más grande. Eso es conciencia, no fracaso.`;
  }
}

// ── Screen Navigation ──────────────────────────────────────────
const SCREENS = ['welcome','emotion','thermo','body','tools','summary','adult'];
let activeScreen = 'welcome';

function showScreen(id, direction = 'forward') {
  const current = document.getElementById(`screen-${activeScreen}`);
  const next    = document.getElementById(`screen-${id}`);
  if (!next) return;

  if (current) {
    current.classList.add('slide-out');
    setTimeout(() => {
      current.classList.remove('active', 'slide-out');
    }, 300);
  }

  // Reset next screen transform
  next.style.transform = direction === 'back' ? 'translateX(-40px)' : 'translateX(40px)';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      next.classList.add('active');
      next.style.transform = '';
    });
  });

  activeScreen = id;
  syncSoundToggles();
}

// ── Sound Controls ─────────────────────────────────────────────
function syncSoundToggles() {
  const enabled = AppState.get('soundEnabled');
  document.querySelectorAll('.sound-toggle').forEach(btn => {
    btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    btn.textContent = enabled ? '🔊' : '🔇';
    btn.setAttribute('aria-label', enabled ? 'Sonido activado, toca para apagar' : 'Sonido apagado, toca para activar');
  });
}

function initSoundControls() {
  // All sound toggle buttons (one per screen)
  document.querySelectorAll('.sound-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = AppState.get('soundEnabled');
      const next = !current;
      AppState.set('soundEnabled', next);
      AudioSystem.setEnabled(next);
      if (next) AudioSystem.playUI(520, 0.15);
      syncSoundToggles();
    });
  });

  // Volume slider (only on welcome screen)
  const volSlider = document.getElementById('volume-slider');
  const volLabel  = document.getElementById('volume-label');
  if (volSlider) {
    volSlider.addEventListener('input', () => {
      const v = parseFloat(volSlider.value);
      AppState.set('volume', v);
      AudioSystem.setVolume(v);
      if (volLabel) volLabel.textContent = Math.round(v * 100) + '%';
    });
  }
}

// ── Emotion Screen ─────────────────────────────────────────────
function buildEmotionGrid() {
  const grid = document.getElementById('emotion-grid');
  if (!grid) return;
  grid.innerHTML = '';

  EMOTIONS.forEach(em => {
    const btn = document.createElement('button');
    btn.className = 'emotion-card';
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('data-emotion', em.key);
    btn.setAttribute('aria-label', em.label);
    btn.style.background = em.bg;
    btn.innerHTML = `
      <span class="emotion-emoji" aria-hidden="true">${em.emoji}</span>
      <span class="emotion-name">${em.label}</span>
    `;
    btn.addEventListener('click', () => selectEmotion(btn, em));
    grid.appendChild(btn);
  });
}

function selectEmotion(btn, emotion) {
  // Init audio on first user interaction
  AudioSystem.init();
  AudioSystem.playEmotion(emotion.key);

  document.querySelectorAll('.emotion-card').forEach(b => b.setAttribute('aria-pressed', 'false'));
  btn.setAttribute('aria-pressed', 'true');
  AppState.set('selectedEmotion', emotion);

  // Enable next button
  const nextBtn = document.getElementById('btn-go-thermo');
  if (nextBtn) nextBtn.disabled = false;
}

function initCustomEmotion() {
  const input = document.getElementById('custom-emotion-input');
  const addBtn = document.getElementById('btn-add-emotion');
  if (!input || !addBtn) return;

  const doAdd = () => {
    const text = input.value.trim();
    if (!text) return;

    const em = { key: 'custom', emoji: '💭', label: text, bg: '#f5f5ff' };
    const grid = document.getElementById('emotion-grid');

    // Remove existing custom card
    grid?.querySelectorAll('[data-emotion="custom"]').forEach(el => el.remove());

    const btn = document.createElement('button');
    btn.className = 'emotion-card';
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('data-emotion', 'custom');
    btn.setAttribute('aria-label', text);
    btn.style.background = em.bg;
    btn.innerHTML = `
      <span class="emotion-emoji" aria-hidden="true">${em.emoji}</span>
      <span class="emotion-name">${text}</span>
    `;
    btn.addEventListener('click', () => selectEmotion(btn, em));
    grid?.appendChild(btn);

    input.value = '';
    btn.click(); // Auto-select
    AudioSystem.playUI(520, 0.15);
  };

  addBtn.addEventListener('click', doAdd);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') doAdd(); });
}

// ── Body Sensations ────────────────────────────────────────────
function buildBodySensationsGrid() {
  const grid = document.getElementById('body-sensations-grid');
  if (!grid) return;
  grid.innerHTML = '';

  BODY_SENSATIONS.forEach(sens => {
    const btn = document.createElement('button');
    btn.className = 'sensation-card';
    btn.setAttribute('role', 'checkbox');
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('data-key', sens.key);
    btn.setAttribute('aria-label', sens.label);
    btn.innerHTML = `<span class="sens-emoji" aria-hidden="true">${sens.emoji}</span>${sens.label}`;

    btn.addEventListener('click', () => {
      const pressed = btn.getAttribute('aria-pressed') === 'true';
      btn.setAttribute('aria-pressed', String(!pressed));
      AudioSystem.playUI(pressed ? 380 : 520, 0.10);

      // Update state
      const current = AppState.get('bodySensations') || [];
      if (!pressed) {
        AppState.set('bodySensations', [...current, sens.label]);
      } else {
        AppState.set('bodySensations', current.filter(s => s !== sens.label));
      }
    });

    grid.appendChild(btn);
  });
}

// ── Summary Screen ─────────────────────────────────────────────
function renderSummary() {
  const emotion   = AppState.get('selectedEmotion');
  const before    = AppState.get('levelBefore');
  const after     = AppState.get('levelAfter');
  const tool      = AppState.get('selectedTool');
  const sensations = AppState.get('bodySensations') || [];

  if (emotion) {
    const badge = document.getElementById('summary-emotion-badge');
    const name  = document.getElementById('summary-emotion-name');
    if (badge) badge.textContent = emotion.emoji;
    if (name)  name.textContent  = emotion.label;
  }

  const beforeEl = document.getElementById('summary-before');
  const afterEl  = document.getElementById('summary-after');
  if (beforeEl) beforeEl.textContent = before;
  if (afterEl)  afterEl.textContent  = after;

  const toolIcon = document.getElementById('summary-tool-icon');
  const toolName = document.getElementById('summary-tool-name');
  if (tool) {
    if (toolIcon) toolIcon.textContent = tool.emoji;
    if (toolName) toolName.textContent = tool.label;
  } else {
    if (toolIcon) toolIcon.textContent = '⭐';
    if (toolName) toolName.textContent = 'Ninguna aún';
  }

  // Body sensations tags
  const sensWrap = document.getElementById('summary-body-sensations');
  if (sensWrap) {
    sensWrap.innerHTML = sensations.length
      ? sensations.map(s => `<span class="sensation-tag">${s}</span>`).join('')
      : '<span class="small-hint">No registraste sensaciones corporales.</span>';
  }

  // Summary message
  const msgEl = document.getElementById('summary-message');
  if (msgEl) msgEl.textContent = getSummaryMessage(before, after, tool);

  // Color after-dot based on improvement
  const afterDot = document.querySelector('.after-dot');
  if (afterDot) {
    if (after < before) afterDot.style.background = '#27ae60';
    else if (after === before) afterDot.style.background = '#3498db';
    else afterDot.style.background = '#e67e22';
  }

  // Play success sound
  if (AppState.get('soundEnabled')) {
    setTimeout(() => AudioSystem.playSuccess(), 300);
  }

  // Save session
  AppState.saveSession();
}

// ── Reset ──────────────────────────────────────────────────────
function showResetModal() {
  document.getElementById('reset-modal')?.classList.remove('hidden');
}
function hideResetModal() {
  document.getElementById('reset-modal')?.classList.add('hidden');
}
function doReset() {
  AppState.resetSession();
  Tools.reset();
  Thermometer.setValue(5);

  // Reset emotion grid
  document.querySelectorAll('.emotion-card').forEach(b => b.setAttribute('aria-pressed', 'false'));
  const nextBtn = document.getElementById('btn-go-thermo');
  if (nextBtn) nextBtn.disabled = true;

  // Reset body sensations
  document.querySelectorAll('.sensation-card').forEach(b => b.setAttribute('aria-pressed', 'false'));

  hideResetModal();
  showScreen('welcome', 'back');
  AudioSystem.playUI(400, 0.15);
}

// ── Main Init ──────────────────────────────────────────────────
function init() {
  // Build dynamic content
  buildEmotionGrid();
  initCustomEmotion();
  buildBodySensationsGrid();

  // Init modules
  Thermometer.init((v) => {
    AppState.set('levelBefore', v);
    // Sync after-slider to match current before value when entering tools screen
  });
  Tools.init();
  AdultPanel.init();
  initSoundControls();

  // ── Navigation ──────────────────────────────────────────────

  // Welcome → Emotion
  document.getElementById('btn-start')?.addEventListener('click', () => {
    AudioSystem.init();
    AudioSystem.playUI(520, 0.15);
    showScreen('emotion');
  });

  // Emotion → Thermo
  document.getElementById('btn-go-thermo')?.addEventListener('click', () => {
    AudioSystem.playUI(540, 0.15);
    showScreen('thermo');
    Thermometer.setValue(AppState.get('levelBefore') ?? 5);
  });

  // Thermo → Body
  document.getElementById('btn-go-body')?.addEventListener('click', () => {
    AppState.set('levelBefore', Thermometer.getValue());
    AudioSystem.playUI(560, 0.15);
    showScreen('body');
  });

  // Body → Tools
  document.getElementById('btn-go-tools')?.addEventListener('click', () => {
    AudioSystem.playUI(580, 0.15);
    Tools.syncAfterSlider();
    showScreen('tools');
  });

  // Tools → Summary
  document.getElementById('btn-go-summary')?.addEventListener('click', () => {
    AppState.set('levelAfter', parseInt(document.getElementById('after-slider')?.value ?? 5));
    Tools.stopBreathingGuide();
    renderSummary();
    showScreen('summary');
  });

  // Summary: try again → tools
  document.getElementById('btn-try-again')?.addEventListener('click', () => {
    AudioSystem.playUI(480, 0.12);
    Tools.reset();
    showScreen('tools', 'back');
  });

  // Summary: finish → welcome
  document.getElementById('btn-finish')?.addEventListener('click', () => {
    showResetModal();
  });

  // Back buttons
  document.getElementById('back-from-emotion')?.addEventListener('click', () => { showScreen('welcome', 'back'); AudioSystem.playUI(440, 0.10); });
  document.getElementById('back-from-thermo')?.addEventListener('click',  () => { showScreen('emotion', 'back');  AudioSystem.playUI(440, 0.10); });
  document.getElementById('back-from-body')?.addEventListener('click',    () => { showScreen('thermo', 'back');  AudioSystem.playUI(440, 0.10); });
  document.getElementById('back-from-tools')?.addEventListener('click',   () => { showScreen('body', 'back');    AudioSystem.playUI(440, 0.10); });
  document.getElementById('back-from-summary')?.addEventListener('click', () => { showScreen('tools', 'back');   AudioSystem.playUI(440, 0.10); });
  document.getElementById('back-from-adult')?.addEventListener('click',   () => { showScreen('welcome', 'back'); AudioSystem.playUI(440, 0.10); });

  // Adult panel link
  document.getElementById('btn-adult-panel')?.addEventListener('click', () => {
    AudioSystem.playUI(480, 0.12);
    showScreen('adult');
  });

  // Reset modal
  document.getElementById('reset-cancel')?.addEventListener('click', hideResetModal);
  document.getElementById('reset-confirm')?.addEventListener('click', doReset);

  // Close modal on overlay click
  document.getElementById('reset-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'reset-modal') hideResetModal();
  });

  // Initial sync
  syncSoundToggles();
  console.log('[Termómetro emocional] App iniciada correctamente.');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
