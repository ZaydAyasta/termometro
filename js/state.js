/**
 * state.js — Estado global de la sesión
 *
 * Almacena datos SOLO en memoria (sin localStorage, sin red).
 * No recopila nombres, diagnósticos ni datos sensibles.
 */

'use strict';

const AppState = (() => {
  const state = {
    // Pantalla actual
    currentScreen: 'welcome',

    // Sesión del niño
    selectedEmotion: null,    // { key, label, emoji }
    levelBefore: 5,
    bodySensations: [],       // Array de strings seleccionados
    selectedTool: null,       // { emoji, label }
    levelAfter: 5,

    // Audio
    soundEnabled: true,
    volume: 0.5,

    // Historial (solo esta sesión)
    sessions: [],
  };

  function get(key) { return state[key]; }
  function set(key, value) { state[key] = value; }

  function resetSession() {
    state.selectedEmotion = null;
    state.levelBefore = 5;
    state.bodySensations = [];
    state.selectedTool = null;
    state.levelAfter = 5;
  }

  function saveSession() {
    if (!state.selectedEmotion) return;
    state.sessions.push({
      emotion:     state.selectedEmotion,
      before:      state.levelBefore,
      sensations:  [...state.bodySensations],
      tool:        state.selectedTool,
      after:       state.levelAfter,
      timestamp:   new Date().toISOString(),
    });
  }

  return { get, set, resetSession, saveSession };
})();

window.AppState = AppState;
