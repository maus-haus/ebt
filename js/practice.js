// Practice mode — step through questions one at a time with immediate answer feedback

import { S, save } from './state.js';
import { QUESTIONS, STATE_QUESTIONS } from './data/questions.js';

function shuffle(arr) {
  return arr.slice().sort(() => Math.random() - 0.5);
}

function allQuestions() {
  const sq = STATE_QUESTIONS[S.state] || [];
  return [
    ...QUESTIONS,
    ...sq.map((q, i) => ({ ...q, id: 'bl_' + i, cat: 'Bundesland' })),
  ];
}

function isUnknown(q) {
  return !S.correct.has(String(q.id));
}

function countUnknown() {
  return allQuestions().filter(isUnknown).length;
}

// Build a shuffled deck based on the current filter
export function buildPracticeDeck() {
  let pool;
  if (S.practiceFilter === 'Unbekannt') {
    // Keep training only unknown cards (not marked correct yet)
    pool = allQuestions().filter(isUnknown);
  } else if (S.practiceFilter === 'Bundesland') {
    const sq = STATE_QUESTIONS[S.state] || [];
    pool = sq.map((q, i) => ({ ...q, id: 'bl_' + i, cat: 'Bundesland' }));
  } else if (S.practiceFilter === 'Alle') {
    pool = allQuestions();
  } else {
    pool = QUESTIONS.filter(q => q.cat === S.practiceFilter);
  }
  S.practiceDeck = pool.slice().sort(() => Math.random() - 0.5);
  S.practiceIdx = 0;
}

function getQ() {
  return S.practiceDeck[S.practiceIdx] || null;
}

function totalQ() { return S.practiceDeck.length; }

export function renderPractice() {
  const q = getQ();
  if (!q) {
    showDone();
    return;
  }

  // Question image
  const imgWrap = document.getElementById('pqImgWrap');
  const img = document.getElementById('pqImg');
  if (q.image) {
    img.src = '/images/questions/' + q.image;
    img.alt = q.text;
    imgWrap.style.display = '';
  } else {
    imgWrap.style.display = 'none';
    img.src = '';
  }

  // Question text
  document.getElementById('pqText').textContent = q.text;

  // Answer options
  const optWrap = document.getElementById('pqOptions');
  optWrap.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'opt-btn';
    btn.innerHTML = `<span class="opt-letter">${letters[i]}</span><span class="opt-text">${opt}</span>`;
    btn.onclick = () => selectAnswer(i);
    optWrap.appendChild(btn);
  });

  // Feedback area
  document.getElementById('pqFeedback').innerHTML = '';
  document.getElementById('pqFeedback').className = 'pq-feedback';
  document.getElementById('pqNextBtn').style.display = 'none';

  // Counter & progress
  const idx = S.practiceIdx + 1;
  const total = totalQ();
  document.getElementById('pqCounter').textContent = `${idx} / ${total}`;
  document.getElementById('pqProg').style.width = ((idx - 1) / total * 100) + '%';
  document.getElementById('pqCat').textContent = q.cat;
}

function selectAnswer(chosen) {
  const q = getQ();
  if (!q) return;
  const correct = q.answer;
  const isRight = chosen === correct;

  // Track
  const qid = String(q.id);
  if (isRight) {
    S.correct.add(qid);
    S.incorrect.delete(qid);
  } else {
    S.incorrect.add(qid);
    S.correct.delete(qid);
  }
  save();
  buildFilterButtons();

  // Colour buttons
  document.querySelectorAll('.opt-btn').forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct)  btn.classList.add('opt-correct');
    if (i === chosen && !isRight) btn.classList.add('opt-wrong');
  });

  // Feedback text
  const fb = document.getElementById('pqFeedback');
  if (isRight) {
    fb.textContent = '✓ Richtig!';
    fb.className = 'pq-feedback fb-correct';
  } else {
    const requeueNote = S.practiceFilter === 'Unbekannt' ? ' · Kommt nochmal 🔁' : '';
    fb.textContent = `✗ Falsch — Richtig: ${q.options[correct]}${requeueNote}`;
    fb.className = 'pq-feedback fb-wrong';
    // In unknown mode, re-queue the question to appear again
    if (S.practiceFilter === 'Unbekannt') {
      const remaining = S.practiceDeck.length - S.practiceIdx - 1;
      const insertAt = S.practiceIdx + 1 + Math.min(3, remaining);
      S.practiceDeck.splice(insertAt, 0, { ...q });
    }
  }

  document.getElementById('pqNextBtn').style.display = '';
}

export function practiceNext() {
  S.practiceIdx++;
  if (S.practiceIdx >= totalQ()) {
    showDone();
  } else {
    renderPractice();
  }
}

export function practiceSkip() {
  const q = getQ();
  if (q) S.skipped.add(String(q.id));
  save();
  S.practiceIdx++;
  if (S.practiceIdx >= totalQ()) showDone();
  else renderPractice();
}

function showDone() {
  if (S.practiceFilter === 'Unbekannt') {
    document.getElementById('pqText').textContent = '🎉 Alle unbekannten Fragen sitzen!';
    document.getElementById('pqOptions').innerHTML = `
      <div class="done-summary">
        <p>Du hast alle unbekannten Fragen dieser Runde richtig beantwortet.</p>
        <p>Gesamtfortschritt: ${S.correct.size} bekannt, ${S.incorrect.size} falsch, ${S.skipped.size} übersprungen</p>
      </div>`;
  } else {
    const total = totalQ();
    const right = S.practiceDeck.filter(q => S.correct.has(String(q.id))).length;
    document.getElementById('pqText').textContent = '🎉 Runde abgeschlossen!';
    document.getElementById('pqOptions').innerHTML = `
      <div class="done-summary">
        <p>In dieser Runde: <strong>${right} / ${total}</strong> richtig</p>
        <p>Gesamtfortschritt: ${S.correct.size} bekannt, ${S.incorrect.size} falsch, ${S.skipped.size} übersprungen</p>
      </div>`;
  }
  document.getElementById('pqFeedback').innerHTML = '';
  document.getElementById('pqNextBtn').style.display = 'none';
  document.getElementById('pqCat').textContent = '';
  document.getElementById('pqCounter').textContent = '';
  document.getElementById('pqProg').style.width = '100%';
}

export function setPracticeFilter(cat) {
  S.practiceFilter = cat;
  buildFilterButtons();
  buildPracticeDeck();
  renderPractice();
}

function buildFilterButtons() {
  const wrap = document.getElementById('practiceFilters');
  const unknownCount = countUnknown();
  wrap.innerHTML = '';

  // Category buttons are mutually exclusive
  const cats = ['Unbekannt', 'Alle', 'Demokratie', 'Geschichte', 'Gesellschaft', 'Europa', 'Bundesland'];
  cats.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (c === S.practiceFilter ? ' active' : '');
    btn.dataset.cat = c;
    btn.textContent = c === 'Unbekannt'
      ? `${c}${unknownCount ? ' ' + unknownCount : ''}`
      : c;
    btn.addEventListener('click', () => setPracticeFilter(c));
    wrap.appendChild(btn);
  });
}

export function refreshPracticeFilters() {
  buildFilterButtons();
}

export function initPractice() {
  buildFilterButtons();
  buildPracticeDeck();
  renderPractice();
}
