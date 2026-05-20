// App state and localStorage persistence

export const S = {
  // Practice mode
  practiceIdx: 0,
  practiceDeck: [],
  practiceFilter: 'Alle',
  practiceUnknownOnly: true,
  correct: new Set(),
  incorrect: new Set(),
  skipped: new Set(),

  // Mock exam
  examDone: 0,
  examBest: 0,

  // State (Bundesland) selection
  state: 'Baden-Württemberg',

  // Accessibility
  a1Cues: false,
};

const KEY = 'ebt_v1';

try {
  const d = JSON.parse(localStorage.getItem(KEY) || '{}');
  if (d.correct)   S.correct   = new Set(d.correct);
  if (d.incorrect) S.incorrect = new Set(d.incorrect);
  if (d.skipped)   S.skipped   = new Set(d.skipped);
  if (d.examDone)  S.examDone  = d.examDone;
  if (d.examBest !== undefined) S.examBest = d.examBest;
  if (d.state)     S.state     = d.state;
  if (d.a1Cues !== undefined) S.a1Cues = Boolean(d.a1Cues);
} catch (e) { /* ignore corrupt data */ }

export function save() {
  localStorage.setItem(KEY, JSON.stringify({
    correct:   [...S.correct],
    incorrect: [...S.incorrect],
    skipped:   [...S.skipped],
    examDone:  S.examDone,
    examBest:  S.examBest,
    state:     S.state,
    a1Cues:    S.a1Cues,
  }));
}

export function resetProgress() {
  S.correct   = new Set();
  S.incorrect = new Set();
  S.skipped   = new Set();
  S.examDone  = 0;
  S.examBest  = 0;
  save();
}
