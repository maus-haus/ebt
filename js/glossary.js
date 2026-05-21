// Shared English support for translated question cards.

export const EN_FLIP_LABEL = 'EN ⇄ DE';

const EN_PHRASE_REPLACEMENTS = [
  [/Bild\s+([1-4])/gi, 'Image $1'],
  [/Welches ist/gi, 'Which is'],
  [/Welches war/gi, 'Which was'],
  [/Welches Land/gi, 'Which country'],
  [/Welche ist/gi, 'Which is'],
  [/Welche war/gi, 'Which was'],
  [/Welche\s+/gi, 'Which '],
  [/Welcher\s+/gi, 'Which '],
  [/Was zeigt dieses Bild\??/gi, 'What does this picture show?'],
  [/Was bedeutet/gi, 'What does it mean'],
  [/Was wollte/gi, 'What did'],
  [/Nach dem Zweiten Weltkrieg/gi, 'After the Second World War'],
  [/Bundesrepublik Deutschland/gi, 'Federal Republic of Germany'],
  [/Europäischen Union/gi, 'European Union'],
  [/Europäische Union/gi, 'European Union'],
  [/Deutschen Bundestages/gi, 'German Bundestag'],
  [/Deutschen Demokratischen Republik/gi, 'German Democratic Republic'],
];

const EN_WORD_MAP = {
  welches: 'which',
  welche: 'which',
  welcher: 'which',
  was: 'what',
  ist: 'is',
  war: 'was',
  sind: 'are',
  der: 'the',
  die: 'the',
  das: 'the',
  den: 'the',
  dem: 'the',
  des: 'of the',
  ein: 'a',
  eine: 'a',
  einem: 'a',
  einen: 'a',
  und: 'and',
  oder: 'or',
  nicht: 'not',
  in: 'in',
  im: 'in the',
  am: 'on the',
  zu: 'to',
  zur: 'to the',
  zum: 'to the',
  von: 'of',
  mit: 'with',
  nach: 'after',
  deutschland: 'Germany',
  land: 'country',
  bundesland: 'federal state',
  bundesländer: 'federal states',
  bundeslandes: 'federal state',
  frage: 'question',
  fragen: 'questions',
  antwort: 'answer',
  antworten: 'answers',
  richtig: 'correct',
  falsch: 'wrong',
  bild: 'image',
  flagge: 'flag',
  wappen: 'coat of arms',
  bundespräsident: 'Federal President',
  bundeskanzler: 'Federal Chancellor',
  bundeskanzleramt: 'Federal Chancellery',
  bundesverfassungsgericht: 'Federal Constitutional Court',
  bundestag: 'Bundestag',
  bundesrat: 'Bundesrat',
  europa: 'Europe',
  eu: 'EU',
  frieden: 'peace',
  sicherheit: 'security',
  freiheit: 'freedom',
  gleichberechtigung: 'equal rights',
  wiedervereinigung: 'reunification',
  währungsreform: 'currency reform',
  besatzungszone: 'occupation zone',
  besatzungszonen: 'occupation zones',
  beteiligt: 'involved',
  weltkrieg: 'world war',
  zweiten: 'second',
  deutscher: 'German',
  deutschen: 'German',
};

function normalize(text) {
  return String(text)
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss');
}

function translateGermanToEnglish(text) {
  if (!text) return '';
  let out = String(text).trim();
  if (!out) return '';

  out = EN_PHRASE_REPLACEMENTS.reduce(
    (acc, [pattern, replacement]) => acc.replace(pattern, replacement),
    out
  );

  out = out.replace(/[A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß-]*/g, word => {
    const key = normalize(word);
    return EN_WORD_MAP[key] || word;
  });

  out = out.replace(/\s+([,.;:!?])/g, '$1').replace(/\s{2,}/g, ' ').trim();
  return out.charAt(0).toUpperCase() + out.slice(1);
}

export function getEnglishSupport(question) {
  if (!question) return null;
  if (question.textEn) {
    return {
      question: question.textEn,
      options: question.optionsEn || (question.options || []).map(opt => translateGermanToEnglish(opt)),
    };
  }
  return {
    question: translateGermanToEnglish(question.text || ''),
    options: (question.options || []).map(opt => translateGermanToEnglish(opt)),
  };
}
