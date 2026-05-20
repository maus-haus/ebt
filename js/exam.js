// Mock Exam mode — 33 random questions (30 general + 3 state-specific), score at end

import { S, save } from './state.js';
import { QUESTIONS, STATE_QUESTIONS } from './data/questions.js';
import { getAdvancedCues, getQuestionReadingAid, getEnglishSupport } from './glossary.js';

const EXAM_TOTAL = 33;
const EXAM_GENERAL = 30;
const EXAM_STATE = 3;
const PASS_SCORE = 17;

let examDeck = [];
let examAnswers = [];
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
  btn.textContent = 'EN ⇄ DE';
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
  wrap.innerHTML = `
    <div class="en-back-title">🇬🇧 English support</div>
    <div class="en-back-note">Tap EN ⇄ DE to switch views.</div>
    <span class="en-back-label">Question</span>
    <div class="en-back-question">${esc(english?.question || q.text || '')}</div>
    <span class="en-back-label">Answers</span>
    <ol class="en-back-list">
      ${(q.options || []).map((opt, i) => `
        <li>
          <div class="en-back-pair">
            <span><strong>${letters[i]}.</strong> ${esc((english?.options && english.options[i]) || opt)}</span>
            <span class="en-back-de">${esc(opt)}</span>
          </div>
        </li>`).join('')}
    </ol>`;
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
  renderA1Cues(q);
  renderExamEnglishBack(q);
  setExamFlip(false);
  document.getElementById('eqCat').textContent = q.cat;

  const wrap = document.getElementById('eqOptions');
  wrap.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'opt-btn' + (examAnswers[examCurrent] === i ? ' opt-selected' : '');
    btn.innerHTML = `<span class="opt-letter">${letters[i]}</span><span class="opt-text">${opt}</span>`;
    btn.onclick = () => selectExamAnswer(i);
    wrap.appendChild(btn);
  });

  document.getElementById('examPrevBtn').style.display = examCurrent > 0 ? '' : 'none';
  document.getElementById('examNextBtn').textContent = examCurrent < total - 1 ? 'Weiter →' : 'Auswerten';
}

function selectExamAnswer(chosen) {
  examAnswers[examCurrent] = chosen;
  document.querySelectorAll('#eqOptions .opt-btn').forEach((btn, i) => {
    btn.classList.toggle('opt-selected', i === chosen);
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

function renderA1Cues(q) {
  const wrap = document.getElementById('eqCueWrap');
  if (!wrap) return;
  if (!S.a1Cues) {
    wrap.hidden = true;
    wrap.innerHTML = '';
    return;
  }
  const cues = getAdvancedCues(q);
  const readingAid = getQuestionReadingAid(q);
  if (!cues.length && !readingAid) {
    wrap.hidden = true;
    wrap.innerHTML = '';
    return;
  }
  const readingBlock = readingAid
    ? `<div class="a1-read-wrap">
        <div class="a1-read-title">🪜 Einfach lesen</div>
        ${readingAid.simple ? `<p class="a1-read-text">${esc(readingAid.simple)}</p>` : ''}
        ${readingAid.notes.length ? `<ul class="a1-read-list">${readingAid.notes.map(n => `<li>${esc(n)}</li>`).join('')}</ul>` : ''}
        ${readingAid.hints.length ? `<div class="a1-read-hints">${readingAid.hints.map(h => `<span class="a1-read-chip">${esc(h)}</span>`).join('')}</div>` : ''}
      </div>`
    : '';
  wrap.hidden = false;
  wrap.innerHTML =
    `${readingBlock}
     <div class="a1-cue-title">🧩 Wort-Hilfe (über A1)</div>
     <div class="a1-cue-list">${
       cues.map(c => `<span class="a1-cue-chip"><strong>${esc(c.de)}</strong> = ${esc(c.en)}</span>`).join('')
     }</div>`;
}

export function refreshExamView() {
  if (examActive && examDeck.length) {
    renderExamQ();
  }
}

export function initExam() {
  examReset();
}
