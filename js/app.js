// Entry point — wire up all modules

import { go, initNav } from './nav.js';
import { initPractice, setPracticeFilter, practiceNext, practiceSkip, refreshPracticeFilters } from './practice.js';
import { initExam, startExam, examNext, examPrev, examReset } from './exam.js';
import { initOverview, renderOverview, buildStateSelect, changeState, confirmReset, toggleA1Cues } from './overview.js';
import { A1_GLOSSARY } from './glossary.js';

function renderA1Glossary() {
  const wrap = document.getElementById('a1GlossaryList');
  if (!wrap || wrap._ready) return;
  wrap._ready = true;
  wrap.innerHTML = A1_GLOSSARY.map(item =>
    `<div class="a1-glossary-item"><span class="a1-glossary-de">${item.de}</span><span class="a1-glossary-en">${item.en}</span></div>`
  ).join('');
}

function initCheatTabs() {
  renderA1Glossary();
  switchCheatTab('ct-glossar');
  const nav = document.querySelector('.cheat-tabs');
  if (nav && !nav._kbBound) {
    nav._kbBound = true;
    nav.addEventListener('keydown', e => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const btns = [...nav.querySelectorAll('.cheat-tab-btn')];
      const idx = btns.indexOf(document.activeElement);
      if (idx === -1) return;
      const next = (idx + (e.key === 'ArrowRight' ? 1 : -1) + btns.length) % btns.length;
      btns[next].focus();
      switchCheatTab(btns[next].dataset.tab);
      e.preventDefault();
    });
  }
}

function switchCheatTab(id) {
  document.querySelectorAll('.cheat-panel').forEach(p => { p.hidden = p.id !== id; });
  document.querySelectorAll('.cheat-tab-btn').forEach(b => {
    const on = b.dataset.tab === id;
    b.classList.toggle('active', on);
    b.setAttribute('aria-selected', on ? 'true' : 'false');
  });
}

// Wrap go() so navigating to overview always re-renders fresh counts
const _go = go;
function goWithRefresh(sec) {
  _go(sec);
  if (!sec || sec === 'overview') renderOverview();
  if (sec === 'practice') refreshPracticeFilters();
  if (sec === 'cheatsheet') initCheatTabs();
}

// Expose to window for onclick handlers in HTML
Object.assign(window, {
  go: goWithRefresh,
  setPracticeFilter,
  practiceNext,
  practiceSkip,
  startExam,
  examNext,
  examPrev,
  examReset,
  changeState,
  confirmReset,
  toggleA1Cues,
  renderOverview,
  switchCheatTab,
});

// Init modules
buildStateSelect();
initOverview();
initPractice();
initExam();
initNav();

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(reg => reg.update())
    .catch(() => {});
}

// Navigate to hash or default
goWithRefresh(location.hash.slice(1) || 'overview');
