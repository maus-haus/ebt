// Mock Exam mode — 33 random questions (30 general + 3 state-specific), score at end

import { S, save } from './state.js';
import { QUESTIONS, STATE_QUESTIONS } from './data/questions.js';
import { getEnglishSupport, EN_FLIP_LABEL } from './glossary.js';

const EXAM_TOTAL = 33;
const EXAM_GENERAL = 30;
const EXAM_STATE = 3;
const PASS_SCORE = 17;

let examDeck = [];
let examAnswers = [];
let examOptionOrders = [];
let examCurrent = 0;
let examActive = false;
let examFlipped = false;

// Escape text for safe DOM insertion
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function shuffle(arr) {
  return arr.slice().sort(() => Math.random() - 0.5);
}

function setExamFlip(flipped) {
  const card = document.getElementById('eqCard');
  const btn = document.getElementById('eqFlipBtn');
  if (!card || !btn) return;
  examFlipped = !!flipped;
  card.classList.toggle('is-flipped', examFlipped);
  btn.textContent = EN_FLIP_LABEL;
  btn.setAttribute('aria-pressed', examFlipped ? 'true' : 'false');
  btn.setAttribute(
    'aria-label',
    examFlipped ? 'Karte drehen: Deutsch anzeigen' : 'Karte drehen: Englisch anzeigen'
  );
}

function renderExamEnglishBack(q) {
  const wrap = document.getElementById('eqBack');
  if (!wrap || !q) return;
  const english = getEnglishSupport(q);
  const letters = ['A', 'B', 'C', 'D'];
  const enQuestion = (english?.question || '').trim();
  const optOrder = examOptionOrders[examCurrent] || [0, 1, 2, 3];
  wrap.innerHTML = `
    <span class="en-back-label">Question</span>
    <div class="en-back-question">${esc(enQuestion || 'English translation unavailable')}</div>
    <span class="en-back-label">Answers</span>
    <ul class="en-back-list">
      ${optOrder.map((origIdx, displayIdx) => `
        <li>
          <div class="en-back-pair">
            <span><strong>${letters[displayIdx]}.</strong> ${esc((english?.options && english.options[origIdx] || '').trim() || 'English translation unavailable')}</span>
          </div>
        </li>`).join('')}
    </ul>`;
}

export function examToggleEnglish() {
  if (!examActive || !examDeck.length) return;
  setExamFlip(!examFlipped);
}

export function startExam() {
  // Build 30 general + 3 state questions
  const general = shuffle(QUESTIONS).slice(0, EXAM_GENERAL);
  const statePool = STATE_QUESTIONS[S.state] || [];
  const stateQ = shuffle(statePool).slice(0, Math.min(EXAM_STATE, statePool.length))
    .map((q, i) => ({ ...q, id: 'bl_' + i, cat: 'Bundesland' }));

  examDeck = shuffle([...general, ...stateQ]);
  examAnswers = new Array(examDeck.length).fill(null);
  examOptionOrders = examDeck.map(() => shuffle([0, 1, 2, 3]));
  examCurrent = 0;
  examActive = true;

  document.getElementById('examIntro').style.display = 'none';
  document.getElementById('examQuiz').style.display = '';
  document.getElementById('examResult').style.display = 'none';

  renderExamQ();
}

function renderExamQ() {
  const q = examDeck[examCurrent];
  const total = examDeck.length;

  document.getElementById('eqCounter').textContent = `Frage ${examCurrent + 1} / ${total}`;
  document.getElementById('eqProg').style.width = (examCurrent / total * 100) + '%';

  // Question image
  const imgWrap = document.getElementById('eqImgWrap');
  const img = document.getElementById('eqImg');
  if (q.image) {
    img.src = '/images/questions/' + q.image;
    img.alt = q.text;
    imgWrap.style.display = '';
  } else {
    imgWrap.style.display = 'none';
    img.src = '';
  }

  document.getElementById('eqText').textContent = q.text;
  renderExamEnglishBack(q);
  setExamFlip(false);
  document.getElementById('eqCat').textContent = q.cat;

  const wrap = document.getElementById('eqOptions');
  wrap.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  const optOrder = examOptionOrders[examCurrent];
  optOrder.forEach((origIdx, displayIdx) => {
    const btn = document.createElement('button');
    btn.className = 'opt-btn' + (examAnswers[examCurrent] === origIdx ? ' opt-selected' : '');
    btn.innerHTML = `<span class="opt-letter">${letters[displayIdx]}</span><span class="opt-text">${q.options[origIdx]}</span>`;
    btn.onclick = () => selectExamAnswer(origIdx);
    wrap.appendChild(btn);
  });

  document.getElementById('examPrevBtn').style.display = examCurrent > 0 ? '' : 'none';
  document.getElementById('examNextBtn').textContent = examCurrent < total - 1 ? 'Weiter →' : 'Auswerten';
}

function selectExamAnswer(chosen) {
  examAnswers[examCurrent] = chosen;
  const optOrder = examOptionOrders[examCurrent];
  document.querySelectorAll('#eqOptions .opt-btn').forEach((btn, displayIdx) => {
    btn.classList.toggle('opt-selected', optOrder[displayIdx] === chosen);
  });
}

export function examPrev() {
  if (examCurrent > 0) {
    examCurrent--;
    renderExamQ();
  }
}

export function examNext() {
  if (examCurrent < examDeck.length - 1) {
    examCurrent++;
    renderExamQ();
  } else {
    finishExam();
  }
}

function finishExam() {
  examActive = false;
  const total = examDeck.length;
  let score = 0;
  const review = [];

  examDeck.forEach((q, i) => {
    const chosen = examAnswers[i];
    const right = chosen === q.answer;
    if (right) score++;
    review.push({ q, chosen, right });
  });

  S.examDone++;
  if (score > S.examBest) S.examBest = score;
  save();

  // Show result
  document.getElementById('examQuiz').style.display = 'none';
  document.getElementById('examResult').style.display = '';

  const passed = score >= PASS_SCORE;
  document.getElementById('examScore').textContent = `${score} / ${total}`;
  document.getElementById('examVerdict').textContent = passed
    ? '🎉 Bestanden! (≥ 17 richtig)'
    : `❌ Nicht bestanden (< 17 richtig)`;
  document.getElementById('examVerdict').className = 'exam-verdict ' + (passed ? 'verdict-pass' : 'verdict-fail');
  document.getElementById('examBest').textContent = `Bisher bestes Ergebnis: ${S.examBest} / ${total}`;
  document.getElementById('examCount').textContent = `Prüfungssimulationen gesamt: ${S.examDone}`;

  // Detailed review
  const revWrap = document.getElementById('examReview');
  revWrap.innerHTML = review.map(({ q, chosen, right }, i) => {
    const chosenText = chosen !== null ? esc(q.options[chosen]) : '(keine Antwort)';
    const imgHtml = q.image
      ? `<img class="q-img rev-q-img" src="/images/questions/${esc(q.image)}" alt="${esc(q.text)}">`
      : '';
    return `<div class="rev-item ${right ? 'rev-right' : 'rev-wrong'}">
      <div class="rev-num">Frage ${i + 1} <span class="rev-cat">${esc(q.cat)}</span></div>
      ${imgHtml}<div class="rev-text">${esc(q.text)}</div>
      <div class="rev-answer">
        ${right
          ? `<span class="rev-correct">✓ ${chosenText}</span>`
          : `<span class="rev-incorrect">✗ Deine Antwort: ${chosenText}</span>
             <span class="rev-correct">✓ Richtig: ${esc(q.options[q.answer])}</span>`
        }
      </div>
    </div>`;
  }).join('');
}

export function examReset() {
  examActive = false;
  setExamFlip(false);
  document.getElementById('examIntro').style.display = '';
  document.getElementById('examQuiz').style.display = 'none';
  document.getElementById('examResult').style.display = 'none';

  // Update state name in intro
  document.getElementById('examStateName').textContent = S.state;
}

export function refreshExamView() {
  if (examActive && examDeck.length) {
    renderExamQ();
  }
}

export function initExam() {
  examReset();
}
