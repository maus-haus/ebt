// Overview / home page — stats + state selector

import { S, save, resetProgress } from './state.js';
import { QUESTIONS, STATES } from './data/questions.js';
import { buildPracticeDeck, renderPractice } from './practice.js';

export function initOverview() {
  renderOverview();
}

export function renderOverview() {
  const total = QUESTIONS.length;
  const done  = S.correct.size + S.incorrect.size;
  const pct   = total > 0 ? Math.round(done / total * 100) : 0;
  const correctPct = done > 0 ? Math.round(S.correct.size / done * 100) : 0;

  document.getElementById('ovTotal').textContent     = total;
  document.getElementById('ovDone').textContent      = done;
  document.getElementById('ovCorrect').textContent   = S.correct.size;
  document.getElementById('ovIncorrect').textContent = S.incorrect.size;
  document.getElementById('ovPct').textContent       = pct + '%';
  document.getElementById('ovCorrectPct').textContent = correctPct + '%';
  document.getElementById('ovExamDone').textContent  = S.examDone;
  document.getElementById('ovExamBest').textContent  = S.examBest + ' / 33';
  document.getElementById('ovProgFill').style.width  = pct + '%';

  // State selector
  const sel = document.getElementById('stateSelect');
  if (sel) {
    sel.value = S.state;
  }
}

export function changeState(val) {
  S.state = val;
  save();
  // Refresh exam intro state name
  const examStateName = document.getElementById('examStateName');
  if (examStateName) examStateName.textContent = val;
  // If practice is on Bundesland filter, rebuild
  if (S.practiceFilter === 'Bundesland') {
    buildPracticeDeck();
    renderPractice();
  }
}

export function confirmReset() {
  if (confirm('Gesamten Fortschritt zurücksetzen?')) {
    resetProgress();
    renderOverview();
  }
}

export function buildStateSelect() {
  const sel = document.getElementById('stateSelect');
  if (!sel) return;
  STATES.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    sel.appendChild(opt);
  });
  sel.value = S.state;
  sel.addEventListener('change', () => changeState(sel.value));
}
