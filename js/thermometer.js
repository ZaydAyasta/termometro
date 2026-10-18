/**
 * thermometer.js — Termómetro vertical táctil y accesible
 *
 * Permite:
 *  - Arrastrar con el dedo directamente sobre el tubo
 *  - Usar el slider <input type="range"> (accesible)
 *  - Teclado: el slider soporta flechas
 *
 * Actualiza colores, mensajes de zona y retroalimentación en tiempo real.
 */

'use strict';

const Thermometer = (() => {
  let value = 5;
  let isDragging = false;
  let onChangeCallback = null;

  // DOM refs (set in init)
  let tubeWrap, fill, handle, bulb, numberEl,
      zoneBadge, messageEl, slider,
      dotHead, dotChest, dotBelly, dotHands,
      thermoNumber;

  // ── Zone configuration ──────────────────────────────────────
  const ZONES = [
    { min: 0,  max: 0,  badge: '🔵 Tranquilidad',       color: '#56b8ed',
      message: 'Noto mi cuerpo tranquilo. Puedo observar cómo me siento.',
      bulbColor: '#56b8ed' },
    { min: 1,  max: 3,  badge: '🟢 Emoción leve',        color: '#8adca3',
      message: 'Siento algo. Puedo respirar y notar qué pasa en mi cuerpo.',
      bulbColor: '#8adca3' },
    { min: 4,  max: 6,  badge: '🟡 Emoción moderada',    color: '#ffe278',
      message: 'Se siente bastante. Puedo buscar una herramienta o hacer una pausa.',
      bulbColor: '#ffe278' },
    { min: 7,  max: 8,  badge: '🟠 Emoción alta',        color: '#ff9c5a',
      message: 'Se siente muy fuerte. Pedir compañía a un adulto es una buena idea.',
      bulbColor: '#ff9c5a' },
    { min: 9,  max: 10, badge: '🔴 Emoción muy intensa', color: '#fa647a',
      message: '¡Es mucho! Busca a alguien de confianza. Siempre está bien pedir ayuda.',
      bulbColor: '#fa647a' },
  ];

  function getZone(v) {
    return ZONES.find(z => v >= z.min && v <= z.max) || ZONES[0];
  }

  // ── Render ──────────────────────────────────────────────────
  function render(v) {
    value = v;
    const pct = v * 10; // 0–100%
    const zone = getZone(v);

    // Fill height
    if (fill) fill.style.height = pct + '%';

    // Handle position (bottom of tube)
    const tubeEl = tubeWrap?.querySelector('.thermo-tube');
    if (handle && tubeEl) {
      const tubeH = tubeEl.clientHeight || 380;
      const handleBottom = (pct / 100) * tubeH;
      handle.style.bottom = handleBottom + 'px';
    }

    // Bulb color
    if (bulb) bulb.style.background = zone.bulbColor;

    // Number
    if (thermoNumber) {
      thermoNumber.textContent = v;
      thermoNumber.style.color = zone.bulbColor === '#ffe278' ? '#c9900a' : zone.bulbColor;
    }

    // Zone badge & message
    if (zoneBadge) zoneBadge.textContent = zone.badge;
    if (messageEl) messageEl.textContent = zone.message;

    // Slider sync
    if (slider) {
      slider.value = v;
      slider.setAttribute('aria-valuetext', `${v} de 10 — ${zone.badge}`);
    }

    // Body dots activation based on intensity
    const high = v >= 7;
    const mid  = v >= 4;
    if (dotHead)  dotHead.classList.toggle('active', high);
    if (dotChest) dotChest.classList.toggle('active', mid);
    if (dotBelly) dotBelly.classList.toggle('active', mid);
    if (dotHands) dotHands.classList.toggle('active', high);

    // Callback
    if (onChangeCallback) onChangeCallback(v, zone);
  }

  // ── Touch/Mouse drag on tube ─────────────────────────────────
  function valueFromY(clientY) {
    const tubeEl = tubeWrap?.querySelector('.thermo-tube');
    if (!tubeEl) return value;
    const rect = tubeEl.getBoundingClientRect();
    const relY = rect.bottom - clientY;       // 0 = bottom, height = top
    const clamped = Math.max(0, Math.min(rect.height, relY));
    const raw = (clamped / rect.height) * 10;
    return Math.round(raw);
  }

  function onPointerDown(e) {
    isDragging = true;
    tubeWrap.setPointerCapture(e.pointerId);
    const v = valueFromY(e.clientY);
    render(v);
    AudioSystem.playUI(300 + v * 40, 0.08);
  }
  function onPointerMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const v = valueFromY(e.clientY);
    if (v !== value) {
      render(v);
      AudioSystem.playUI(300 + v * 40, 0.05);
    }
  }
  function onPointerUp() {
    isDragging = false;
    AppState.set('levelBefore', value);
  }

  // ── Init ─────────────────────────────────────────────────────
  function init(onChange) {
    onChangeCallback = onChange || null;

    tubeWrap   = document.getElementById('thermo-tube-wrap');
    fill       = document.getElementById('thermo-fill');
    handle     = document.getElementById('thermo-handle');
    bulb       = document.getElementById('thermo-bulb');
    zoneBadge  = document.getElementById('thermo-zone-badge');
    messageEl  = document.getElementById('thermo-message');
    slider     = document.getElementById('level-slider');
    thermoNumber = document.getElementById('thermo-number');
    dotHead    = document.getElementById('dot-head');
    dotChest   = document.getElementById('dot-chest');
    dotBelly   = document.getElementById('dot-belly');
    dotHands   = document.getElementById('dot-hands');

    if (!tubeWrap) return;

    // Pointer events for drag
    tubeWrap.addEventListener('pointerdown', onPointerDown);
    tubeWrap.addEventListener('pointermove', onPointerMove);
    tubeWrap.addEventListener('pointerup',   onPointerUp);
    tubeWrap.addEventListener('pointercancel', onPointerUp);

    // Touch fallback
    tubeWrap.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

    // Range slider
    if (slider) {
      slider.addEventListener('input', () => {
        const v = parseInt(slider.value, 10);
        render(v);
        AudioSystem.playUI(300 + v * 40, 0.05);
        AppState.set('levelBefore', v);
      });
    }

    render(AppState.get('levelBefore') ?? 5);
  }

  function getValue() { return value; }
  function setValue(v) { render(v); }

  return { init, getValue, setValue, render, getZone };
})();

window.Thermometer = Thermometer;
