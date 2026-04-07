// Entry point — wire up all modules

import { go, initNav } from './nav.js';
import { initPractice, setPracticeFilter, practiceNext, practiceSkip } from './practice.js';
import { initExam, startExam, examNext, examPrev, examReset } from './exam.js';
import { initOverview, renderOverview, buildStateSelect, changeState, confirmReset } from './overview.js';

// Expose to window for onclick handlers in HTML
Object.assign(window, {
  go,
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
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

// Navigate to hash or default
go(location.hash.slice(1) || 'overview');
