// Shared vocabulary support for words above A1 (glossary + contextual cue matching)

export const ADVANCED_GLOSSARY = [
  { de: 'Gewaltenteilung', en: 'separation of powers' },
  { de: 'Rechtsstaat', en: 'constitutional state / rule of law' },
  { de: 'Menschenwürde', en: 'human dignity' },
  { de: 'Meinungsfreiheit', en: 'freedom of speech' },
  { de: 'Gleichberechtigung', en: 'equal rights' },
  { de: 'Niederlassungsfreiheit', en: 'freedom of establishment' },
  { de: 'Sozialversicherung', en: 'social insurance system' },
  { de: 'Rentenversicherung', en: 'pension insurance' },
  { de: 'Pflegeversicherung', en: 'long-term care insurance' },
  { de: 'Arbeitslosenversicherung', en: 'unemployment insurance' },
  { de: 'Tarifvertrag', en: 'collective agreement' },
  { de: 'Koalition', en: 'governing coalition' },
  { de: 'Bundesrat', en: 'Federal Council (upper house)' },
  { de: 'Bundesverfassungsgericht', en: 'Federal Constitutional Court' },
  { de: 'Abgeordnete', en: 'member(s) of parliament' },
  { de: 'Legislative', en: 'legislative branch' },
  { de: 'Exekutive', en: 'executive branch' },
  { de: 'Judikative', en: 'judicial branch' },
  { de: 'Souveränität', en: 'sovereignty' },
  { de: 'Wiedervereinigung', en: 'reunification' },
  { de: 'Währungsreform', en: 'currency reform' },
  { de: 'Besatzungszone', en: 'occupation zone' },
  { de: 'Volksaufstand', en: 'popular uprising' },
  { de: 'Erwerbsminderung', en: 'reduced earning capacity' },
  { de: 'Hinterbliebene', en: 'surviving dependants' },
  { de: 'Berufskrankheit', en: 'occupational disease' },
  { de: 'Binnenmarkt', en: 'single market' },
  { de: 'Dienstleistungsfreiheit', en: 'freedom to provide services' },
  { de: 'Freizügigkeit', en: 'freedom of movement' },
  { de: 'Verhältnismäßigkeit', en: 'principle of proportionality' },
];

const SIMPLE_TERM_HINTS = [
  { variants: ['nicht'], hint: '„NICHT“ ist wichtig: Suche die Antwort, die nicht passt.' },
  { variants: ['zweiten weltkrieg', '2. weltkrieg'], hint: '„Zweiter Weltkrieg“: Krieg von 1939 bis 1945.' },
  { variants: ['besetzung', 'besatzungszone', 'besatzungszonen'], hint: '„Besetzung“: Ein Land kontrolliert ein anderes Land.' },
  { variants: ['beteiligt'], hint: '„beteiligt“ bedeutet „dabei / mitgemacht“.' },
  { variants: ['währungsreform'], hint: '„Währungsreform“: neues Geld wird eingeführt.' },
  { variants: ['wiedervereinigung'], hint: '„Wiedervereinigung“: DDR und BRD wurden ein Land.' },
];

const SIMPLE_QUESTION_REWRITES = [
  {
    test: /^welches land war nach dem zweiten weltkrieg nicht an der besetzung deutschlands beteiligt\?$/i,
    simple: 'Nach dem 2. Weltkrieg haben einige Länder Deutschland besetzt. Welches Land war nicht dabei?',
  },
];

const SIMPLE_QUESTION_REPLACEMENTS = [
  [/nach dem Zweiten Weltkrieg/gi, 'nach 1945 (nach dem 2. Weltkrieg)'],
  [/an der Besetzung Deutschlands beteiligt/gi, 'bei der Besetzung von Deutschland dabei'],
  [/Besatzungszonen Deutschlands nach 1945/gi, 'Gebiete in Deutschland nach 1945 (Besatzungszonen)'],
];

const MATCH_TERMS = [
  { de: 'Gewaltenteilung', en: 'separation of powers', variants: ['gewaltenteilung'] },
  { de: 'Rechtsstaat', en: 'constitutional state / rule of law', variants: ['rechtsstaat'] },
  { de: 'Menschenwürde', en: 'human dignity', variants: ['menschenwürde'] },
  { de: 'Legislative', en: 'legislative branch', variants: ['legislative'] },
  { de: 'Exekutive', en: 'executive branch', variants: ['exekutive'] },
  { de: 'Judikative', en: 'judicial branch', variants: ['judikative'] },
  { de: 'Souveränität', en: 'sovereignty', variants: ['souveränität', 'souveraenitaet'] },
  { de: 'Koalition', en: 'governing coalition', variants: ['koalition', 'koalitionen'] },
  { de: 'Abgeordnete', en: 'member(s) of parliament', variants: ['abgeordnete', 'abgeordneten'] },
  { de: 'Bundesverfassungsgericht', en: 'Federal Constitutional Court', variants: ['bundesverfassungsgericht'] },
  { de: 'Bundesrat', en: 'Federal Council (upper house)', variants: ['bundesrat'] },
  { de: 'Verhältnismäßigkeit', en: 'principle of proportionality', variants: ['verhältnismäßigkeit', 'verhaeltnismaessigkeit'] },
  { de: 'Meinungsfreiheit', en: 'freedom of speech', variants: ['meinungsfreiheit'] },
  { de: 'Gleichberechtigung', en: 'equal rights', variants: ['gleichberechtigung'] },
  { de: 'Niederlassungsfreiheit', en: 'freedom of establishment', variants: ['niederlassungsfreiheit'] },
  { de: 'Dienstleistungsfreiheit', en: 'freedom to provide services', variants: ['dienstleistungsfreiheit'] },
  { de: 'Freizügigkeit', en: 'freedom of movement', variants: ['freizügigkeit', 'freizuegigkeit'] },
  { de: 'Binnenmarkt', en: 'single market', variants: ['binnenmarkt'] },
  { de: 'Sozialversicherung', en: 'social insurance system', variants: ['sozialversicherung'] },
  { de: 'Rentenversicherung', en: 'pension insurance', variants: ['rentenversicherung'] },
  { de: 'Pflegeversicherung', en: 'long-term care insurance', variants: ['pflegeversicherung'] },
  { de: 'Arbeitslosenversicherung', en: 'unemployment insurance', variants: ['arbeitslosenversicherung'] },
  { de: 'Erwerbsminderung', en: 'reduced earning capacity', variants: ['erwerbsminderung'] },
  { de: 'Hinterbliebene', en: 'surviving dependants', variants: ['hinterbliebene', 'hinterbliebenen'] },
  { de: 'Berufskrankheit', en: 'occupational disease', variants: ['berufskrankheit', 'berufskrankheiten'] },
  { de: 'Tarifvertrag', en: 'collective agreement', variants: ['tarifvertrag', 'tarifverträge', 'tarifvertraege'] },
  { de: 'Währungsreform', en: 'currency reform', variants: ['währungsreform', 'waehrungsreform'] },
  { de: 'Besatzungszone', en: 'occupation zone', variants: ['besatzungszone', 'besatzungszonen'] },
  { de: 'Volksaufstand', en: 'popular uprising', variants: ['volksaufstand'] },
  { de: 'Wiedervereinigung', en: 'reunification', variants: ['wiedervereinigung'] },
];

function normalize(text) {
  return String(text)
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss');
}

function escapeRegex(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const MATCH_TERMS_COMPILED = MATCH_TERMS.map(term => ({
  de: term.de,
  en: term.en,
  regexes: term.variants.map(v => {
    const needle = normalize(v);
    return new RegExp(`(^|[^a-z0-9_])${escapeRegex(needle)}([^a-z0-9_]|$)`);
  }),
}));

export function getAdvancedCues(question, max = 6) {
  if (!question) return [];
  const text = normalize([question.text, ...(question.options || [])].join(' '));
  const hits = [];
  for (const term of MATCH_TERMS_COMPILED) {
    const indexes = term.regexes
      .map(re => {
        const m = text.match(re);
        if (!m || m.index === undefined) return -1;
        const startOffset = m[1] ? m[1].length : 0;
        return m.index + startOffset;
      })
      .filter(i => i >= 0);
    if (!indexes.length) continue;
    hits.push({ de: term.de, en: term.en, idx: Math.min(...indexes) });
  }
  hits.sort((a, b) => a.idx - b.idx);
  return hits.slice(0, max).map(({ de, en }) => ({ de, en }));
}

export function getQuestionReadingAid(question, maxHints = 3) {
  if (!question || !question.text) return null;
  const original = String(question.text).trim();
  if (!original) return null;

  const normalized = normalize(original);
  const notes = [];

  if (/\bnicht\b/i.test(original)) {
    notes.push('Achte auf „NICHT“: Du suchst die Antwort, die nicht passt.');
  }
  if (/^(welche|welcher|welches|was)\b/i.test(original)) {
    notes.push('Wähle eine Antwort aus den vier Optionen.');
  }

  const hints = SIMPLE_TERM_HINTS
    .filter(item => item.variants.some(v => normalized.includes(normalize(v))))
    .slice(0, maxHints)
    .map(item => item.hint);

  let simple = null;
  const exact = SIMPLE_QUESTION_REWRITES.find(item => item.test.test(original));
  if (exact) {
    simple = exact.simple;
  } else {
    const rewritten = SIMPLE_QUESTION_REPLACEMENTS.reduce(
      (acc, [pattern, replacement]) => acc.replace(pattern, replacement),
      original
    );
    if (rewritten !== original) {
      simple = rewritten;
    }
  }

  if (!simple && !notes.length && !hints.length) return null;
  return { simple, notes, hints };
}
