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
