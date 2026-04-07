// Practice mode — step through questions one at a time with immediate answer feedback

import { S, save } from './state.js';
import { QUESTIONS, STATE_QUESTIONS } from './data/questions.js';

// Track the original deck size for learn-mode progress display
let learnTotal = 0;

function shuffle(arr) {
  return arr.slice().sort(() => Math.random() - 0.5);
}

// Build a shuffled deck based on the current filter
export function buildPracticeDeck() {
  let pool;
  if (S.practiceFilter === 'Bundesland') {
    const sq = STATE_QUESTIONS[S.state] || [];
    pool = sq.map((q, i) => ({ ...q, id: 'bl_' + i, cat: 'Bundesland' }));
  } else if (S.practiceFilter === 'Alle') {
    const sq = STATE_QUESTIONS[S.state] || [];
    const stateQ = sq.map((q, i) => ({ ...q, id: 'bl_' + i, cat: 'Bundesland' }));
    pool = [...QUESTIONS, ...stateQ];
  } else if (S.practiceFilter === 'Lernen') {
    // Flashcard learn mode: incorrect first, then unseen (neither correct nor incorrect)
    const sq = STATE_QUESTIONS[S.state] || [];
    const all = [
      ...QUESTIONS,
      ...sq.map((q, i) => ({ ...q, id: 'bl_' + i, cat: 'Bundesland' })),
    ];
    const wrong  = shuffle(all.filter(q => S.incorrect.has(String(q.id))));
    const unseen = shuffle(all.filter(q => !S.correct.has(String(q.id)) && !S.incorrect.has(String(q.id))));
    pool = [...wrong, ...unseen];
    learnTotal = pool.length;
  } else {
    pool = QUESTIONS.filter(q => q.cat === S.practiceFilter);
  }
  // Shuffle (except learn mode which is already ordered)
  if (S.practiceFilter !== 'Lernen') {
    S.practiceDeck = pool.slice().sort(() => Math.random() - 0.5);
  } else {
    S.practiceDeck = pool;
  }
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
  if (S.practiceFilter === 'Lernen') {
    const mastered = learnTotal - (total - S.practiceIdx);
    document.getElementById('pqCounter').textContent = `Gelernt: ${Math.max(0, mastered)} / ${learnTotal}`;
    document.getElementById('pqProg').style.width = (Math.max(0, mastered) / learnTotal * 100) + '%';
  } else {
    document.getElementById('pqCounter').textContent = `${idx} / ${total}`;
    document.getElementById('pqProg').style.width = ((idx - 1) / total * 100) + '%';
  }
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
    const requeueNote = S.practiceFilter === 'Lernen' ? ' · Kommt nochmal 🔁' : '';
    fb.textContent = `✗ Falsch — Richtig: ${q.options[correct]}${requeueNote}`;
    fb.className = 'pq-feedback fb-wrong';
    // In learn mode, re-queue the question at the end of the deck
    if (S.practiceFilter === 'Lernen') {
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
  if (S.practiceFilter === 'Lernen') {
    document.getElementById('pqText').textContent = '🎉 Alles gelernt!';
    document.getElementById('pqOptions').innerHTML = `
      <div class="done-summary">
        <p>Du hast alle <strong>${learnTotal}</strong> Fragen in dieser Runde richtig beantwortet.</p>
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
  document.querySelectorAll('#practiceFilters button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === cat);
  });
  buildPracticeDeck();
  renderPractice();
}

export function initPractice() {
  // Build filter buttons
  const wrap = document.getElementById('practiceFilters');
  const cats = ['Alle', 'Demokratie', 'Geschichte', 'Gesellschaft', 'Europa', 'Bundesland'];
  wrap.innerHTML = '';
  cats.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (c === S.practiceFilter ? ' active' : '');
    btn.dataset.cat = c;
    btn.textContent = c;
    btn.addEventListener('click', () => setPracticeFilter(c));
    wrap.appendChild(btn);
  });

  buildPracticeDeck();
  renderPractice();
}
