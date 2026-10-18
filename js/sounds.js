/**
 * sounds.js — Sintetizador de sonidos emocionales con Web Audio API
 *
 * Genera sonidos expresivos únicos para cada emoción usando síntesis
 * de audio avanzada (osciladores, modulación, envolventes ADSR).
 *
 * Fallback: si el navegador bloquea el audio, la app sigue funcionando
 * sin sonido. Todo el audio está iniciado por interacción del usuario.
 *
 * Licencia sonidos: generados proceduralmente (sin clips externos).
 * Si se reemplazan por clips WAV/MP3, colocarlos en /sounds/ y declarar
 * su licencia en README.md.
 */

'use strict';

const AudioSystem = (() => {
  let ctx = null;
  let masterGain = null;
  let enabled = true;
  let volume = 0.5;
  let currentlyPlaying = null; // prevent overlapping

  /**
   * Inicializa o reutiliza el AudioContext.
   * Debe llamarse desde un evento de usuario (click/touch).
   */
  function init() {
    if (ctx) {
      if (ctx.state === 'suspended') ctx.resume();
      return true;
    }
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = volume;
      masterGain.connect(ctx.destination);
      return true;
    } catch (e) {
      console.warn('[Audio] Web Audio API no disponible:', e.message);
      return false;
    }
  }

  function setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    if (masterGain) masterGain.gain.setTargetAtTime(volume, ctx.currentTime, 0.05);
  }

  function setEnabled(val) {
    enabled = val;
    if (masterGain) {
      masterGain.gain.setTargetAtTime(val ? volume : 0, ctx.currentTime, 0.05);
    }
  }

  /**
   * Crea un oscilador con envolvente ADSR y lo conecta al masterGain.
   * @param {number} freq      Frecuencia inicial en Hz
   * @param {number} freqEnd   Frecuencia final en Hz (para portamento)
   * @param {number} start     Offset en segundos desde ahora
   * @param {number} dur       Duración del sonido
   * @param {string} type      Tipo de oscilador: sine|triangle|square|sawtooth
   * @param {number} amp       Amplitud pico (0–1)
   * @param {number} attack    Tiempo de ataque (s)
   * @param {number} decay     Tiempo de decaída (s)
   */
  function osc(freq, freqEnd, start, dur, type = 'sine', amp = 0.2, attack = 0.02, decay = null) {
    if (!ctx || !masterGain) return;
    const now = ctx.currentTime + start;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const decayTime = decay ?? dur;

    o.type = type;
    o.frequency.setValueAtTime(freq, now);
    if (freqEnd && freqEnd !== freq) {
      o.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 1), now + dur);
    }

    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(amp, now + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, now + decayTime);

    o.connect(g);
    g.connect(masterGain);
    o.start(now);
    o.stop(now + dur + 0.05);
  }

  /**
   * Nodo de ruido blanco (usado para "shhh" o texturas de nervios).
   */
  function noise(start, dur, amp = 0.05, filterFreq = 1000) {
    if (!ctx || !masterGain) return;
    const now = ctx.currentTime + start;
    const bufferSize = Math.max(1, Math.ceil(ctx.sampleRate * (dur + 0.1)));
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = filterFreq;
    filter.Q.value = 0.8;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(amp, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    src.connect(filter);
    filter.connect(g);
    g.connect(masterGain);
    src.start(now);
    src.stop(now + dur + 0.05);
  }

  // ────────────────────────────────────────────────
  // SONIDOS POR EMOCIÓN
  // Cada función crea un sonido expresivo y único.
  // Duración orientativa: 0.4–1.2 s
  // ────────────────────────────────────────────────

  /**
   * ENOJO — Gruñido suave «grrr»
   * Dientes de sierra bajas + ruido modulado, como una voz ronca y breve.
   */
  function playEnojo() {
    // Tono bajo de sierra — cuerpo del gruñido
    osc(110, 85, 0,    0.35, 'sawtooth', 0.10, 0.01, 0.35);
    osc(118, 80, 0,    0.35, 'sawtooth', 0.08, 0.01, 0.35);
    // Vibrato rápido superior — textura del gruñido
    osc(220, 175, 0.05, 0.30, 'square',  0.04, 0.01, 0.30);
    // Caída final
    osc(90,  55,  0.32, 0.22, 'sawtooth', 0.06, 0.02, 0.22);
    // Ruido de boca
    noise(0, 0.40, 0.04, 300);
  }

  /**
   * ALEGRÍA — Risita breve y cálida
   * Arpeggio ascendente rápido + pequeños «ja ja»
   */
  function playAlegria() {
    // Melodía ascendente tipo risita
    const notes = [523, 659, 784, 1047];
    notes.forEach((f, i) => {
      osc(f, f * 1.02, i * 0.09, 0.12, 'sine', 0.18, 0.01, 0.12);
    });
    // Coda corta
    osc(880, 900, 0.40, 0.18, 'sine', 0.12, 0.01, 0.18);
    // Pequeño "ja" (burst de ruido agudo)
    noise(0.05, 0.08, 0.06, 3000);
    noise(0.20, 0.08, 0.06, 3200);
  }

  /**
   * TRISTEZA — Suspiro o sollozo muy corto
   * Descenso melódico lento + exhalación de ruido.
   */
  function playTristeza() {
    // Descenso melódico (como una nota que cae)
    osc(440, 280, 0,    0.55, 'sine', 0.14, 0.06, 0.55);
    osc(330, 200, 0.18, 0.50, 'sine', 0.10, 0.06, 0.50);
    // Exhalación — ruido suave
    noise(0, 0.70, 0.05, 600);
    // Pequeño sollozo al final
    osc(260, 220, 0.62, 0.22, 'triangle', 0.08, 0.04, 0.22);
  }

  /**
   * MIEDO — Inhalación sorprendida / «¡oh!»
   * Subida rápida de tono + ruido de inhalación.
   */
  function playMiedo() {
    // Inhalación (ruido filtrado ascendente)
    noise(0, 0.20, 0.07, 2000);
    noise(0.05, 0.18, 0.07, 3500);
    // "Oh" — tono que sube rápido
    osc(300, 580, 0,    0.18, 'triangle', 0.12, 0.02, 0.18);
    osc(400, 720, 0.02, 0.18, 'sine',     0.10, 0.02, 0.18);
    // Eco descendente
    osc(350, 200, 0.22, 0.28, 'triangle', 0.07, 0.04, 0.28);
  }

  /**
   * NERVIOS — «uh-oh» discreto / titubeo
   * Patrón sincopado de tonos inquietos.
   */
  function playNervios() {
    // "uh" (tono que baja)
    osc(380, 310, 0,    0.14, 'sine', 0.12, 0.01, 0.14);
    // pequeña pausa
    // "oh" (tono que sube un poco luego baja)
    osc(290, 340, 0.20, 0.12, 'sine', 0.10, 0.02, 0.12);
    osc(340, 260, 0.30, 0.16, 'sine', 0.08, 0.02, 0.16);
    // Vibrato rápido de inquietud
    osc(420, 420, 0.08, 0.10, 'triangle', 0.05, 0.01, 0.10);
    osc(415, 415, 0.38, 0.10, 'triangle', 0.05, 0.01, 0.10);
    // Ruido suave de fondo
    noise(0, 0.50, 0.03, 1200);
  }

  /**
   * TRANQUILIDAD — Exhalación suave + campanilla tenue
   */
  function playCalma() {
    // Campanilla — dos armónicos limpios
    osc(1047, 1047, 0,    0.70, 'sine',     0.12, 0.01, 0.70);
    osc(1319, 1319, 0.02, 0.60, 'sine',     0.08, 0.01, 0.60);
    osc(523,  523,  0.05, 0.65, 'triangle', 0.06, 0.03, 0.65);
    // Exhalación suave
    noise(0.10, 0.60, 0.04, 800);
  }

  /**
   * Sonido genérico (para herramientas, botones UI)
   */
  function playUI(pitch = 500, dur = 0.15) {
    if (!enabled) return;
    if (!init()) return;
    osc(pitch, pitch * 1.05, 0, dur, 'sine', 0.10, 0.01, dur);
  }

  function playSuccess() {
    if (!enabled) return;
    if (!init()) return;
    osc(523, 523, 0,    0.12, 'sine', 0.12, 0.01);
    osc(659, 659, 0.14, 0.12, 'sine', 0.12, 0.01);
    osc(784, 784, 0.28, 0.20, 'sine', 0.14, 0.01);
  }

  // ────────────────────────────────────────────────
  // API pública
  // ────────────────────────────────────────────────

  const EMOTION_MAP = {
    enojo:    playEnojo,
    alegria:  playAlegria,
    tristeza: playTristeza,
    miedo:    playMiedo,
    nervios:  playNervios,
    calma:    playCalma,
    custom:   () => playUI(480, 0.25),
  };

  function playEmotion(emotionKey) {
    if (!enabled) return;
    // Prevent overlap: schedule a very short gap
    if (currentlyPlaying) {
      clearTimeout(currentlyPlaying);
      currentlyPlaying = null;
    }
    if (!init()) return;
    const fn = EMOTION_MAP[emotionKey];
    if (fn) {
      fn();
      currentlyPlaying = setTimeout(() => { currentlyPlaying = null; }, 1200);
    }
  }

  return {
    init,
    setVolume,
    setEnabled,
    playEmotion,
    playUI,
    playSuccess,
  };
})();

// Expose globally
window.AudioSystem = AudioSystem;
