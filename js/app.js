// Entry point — wire up all modules

import { go, initNav } from './nav.js';
import { initPractice, setPracticeFilter, practiceNext, practiceSkip, refreshPracticeFilters } from './practice.js';
import { initExam, startExam, examNext, examPrev, examReset } from './exam.js';
import { initOverview, renderOverview, buildStateSelect, changeState, confirmReset } from './overview.js';

// Wrap go() so navigating to overview always re-renders fresh counts
const _go = go;
function goWithRefresh(sec) {
  _go(sec);
  if (!sec || sec === 'overview') renderOverview();
  if (sec === 'practice') refreshPracticeFilters();
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
  renderOverview,
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
