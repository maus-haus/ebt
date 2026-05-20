// Shared A1 vocabulary support (glossary + contextual cue matching)

export const A1_GLOSSARY = [
  { de: 'Antwort', en: 'answer' },
  { de: 'Arbeit', en: 'work / job' },
  { de: 'Arbeitslos', en: 'unemployed' },
  { de: 'Ausweis', en: 'ID card' },
  { de: 'Behörde', en: 'authority / office' },
  { de: 'Beruf', en: 'profession' },
  { de: 'Bürger', en: 'citizen' },
  { de: 'Bundesland', en: 'federal state' },
  { de: 'Demokratie', en: 'democracy' },
  { de: 'Freiheit', en: 'freedom' },
  { de: 'Gleichberechtigung', en: 'equal rights' },
  { de: 'Gesetz', en: 'law' },
  { de: 'Gesundheit', en: 'health' },
  { de: 'Grundgesetz', en: 'Basic Law / constitution' },
  { de: 'Gericht', en: 'court' },
  { de: 'Kirche', en: 'church' },
  { de: 'Krankenversicherung', en: 'health insurance' },
  { de: 'Meinungsfreiheit', en: 'freedom of speech' },
  { de: 'Parlament', en: 'parliament' },
  { de: 'Partei', en: 'political party' },
  { de: 'Pflicht', en: 'duty / obligation' },
  { de: 'Polizei', en: 'police' },
  { de: 'Prüfung', en: 'exam / test' },
  { de: 'Recht', en: 'right / law' },
  { de: 'Religion', en: 'religion' },
  { de: 'Schule', en: 'school' },
  { de: 'Staat', en: 'state' },
  { de: 'Steuer', en: 'tax' },
  { de: 'Verfassung', en: 'constitution' },
  { de: 'Wahl', en: 'election / vote' },
  { de: 'Wahlrecht', en: 'right to vote' },
  { de: 'Wohnung', en: 'apartment / housing' },
];

const MATCH_TERMS = [
  { de: 'Bundesland', en: 'federal state', variants: ['bundesland', 'bundesländer'] },
  { de: 'Demokratie', en: 'democracy', variants: ['demokratie', 'demokratisch'] },
  { de: 'Gesetz', en: 'law', variants: ['gesetz', 'gesetze', 'gesetzlich'] },
  { de: 'Grundgesetz', en: 'Basic Law / constitution', variants: ['grundgesetz'] },
  { de: 'Parlament', en: 'parliament', variants: ['parlament', 'bundestag', 'bundesrat'] },
  { de: 'Partei', en: 'political party', variants: ['partei', 'parteien'] },
  { de: 'Wahl', en: 'election / vote', variants: ['wahl', 'wählen', 'gewählt'] },
  { de: 'Wahlrecht', en: 'right to vote', variants: ['wahlrecht', 'stimmrecht'] },
  { de: 'Recht', en: 'right / law', variants: ['recht', 'rechte'] },
  { de: 'Pflicht', en: 'duty / obligation', variants: ['pflicht', 'pflichten'] },
  { de: 'Freiheit', en: 'freedom', variants: ['freiheit', 'frei'] },
  { de: 'Meinungsfreiheit', en: 'freedom of speech', variants: ['meinungsfreiheit'] },
  { de: 'Gleichberechtigung', en: 'equal rights', variants: ['gleichberechtigung'] },
  { de: 'Bürger', en: 'citizen', variants: ['bürger', 'bürgerin', 'bürgerinnen', 'bürgern'] },
  { de: 'Ausweis', en: 'ID card', variants: ['ausweis'] },
  { de: 'Behörde', en: 'authority / office', variants: ['behörde', 'behörden', 'amt'] },
  { de: 'Gericht', en: 'court', variants: ['gericht', 'gerichte'] },
  { de: 'Polizei', en: 'police', variants: ['polizei'] },
  { de: 'Verfassung', en: 'constitution', variants: ['verfassung'] },
  { de: 'Staat', en: 'state', variants: ['staat', 'staaten'] },
  { de: 'Religion', en: 'religion', variants: ['religion', 'religionen'] },
  { de: 'Kirche', en: 'church', variants: ['kirche', 'kirchen'] },
  { de: 'Steuer', en: 'tax', variants: ['steuer', 'steuern'] },
  { de: 'Krankenversicherung', en: 'health insurance', variants: ['krankenversicherung'] },
  { de: 'Gesundheit', en: 'health', variants: ['gesundheit', 'gesund'] },
  { de: 'Arbeit', en: 'work / job', variants: ['arbeit', 'arbeiten', 'arbeitsplatz'] },
  { de: 'Arbeitslos', en: 'unemployed', variants: ['arbeitslos', 'arbeitslosigkeit'] },
  { de: 'Schule', en: 'school', variants: ['schule', 'schulen'] },
  { de: 'Wohnung', en: 'apartment / housing', variants: ['wohnung', 'wohnen'] },
  { de: 'Prüfung', en: 'exam / test', variants: ['prüfung', 'prüfungen', 'test'] },
  { de: 'Antwort', en: 'answer', variants: ['antwort', 'antworten'] },
  { de: 'Beruf', en: 'profession', variants: ['beruf', 'berufe'] },
];

function normalize(text) {
  return String(text)
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss');
}

export function getA1Cues(question, max = 6) {
  if (!question) return [];
  const text = normalize([question.text, ...(question.options || [])].join(' '));
  const hits = [];
  for (const term of MATCH_TERMS) {
    const indexes = term.variants
      .map(v => text.indexOf(normalize(v)))
      .filter(i => i >= 0);
    if (!indexes.length) continue;
    hits.push({ de: term.de, en: term.en, idx: Math.min(...indexes) });
  }
  hits.sort((a, b) => a.idx - b.idx);
  return hits.slice(0, max).map(({ de, en }) => ({ de, en }));
}
