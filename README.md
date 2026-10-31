# Einbürgerungstest – Lern-PWA 🇩🇪

A Progressive Web App to help prepare for the German naturalization test
(**Einbürgerungstest / Leben in Deutschland**).

**Live:** https://ebt.gavv.in/

Plain HTML, CSS and JavaScript — no build step, no framework, no dependencies.
Installable to a home screen and works offline after first load.

## Features

| Feature | Details |
|---|---|
| **Practice mode** | All 300 general questions + 160 state-specific (10 per Bundesland), with instant feedback |
| **Unknown filter** | Focus on unknown cards until they are answered correctly |
| **Category filter** | BAMF's 10 official categories (Recht, Politik, Staat, Bund und Länder, Geschichte, Gesellschaft und Familie, Wirtschaft, Religion und Kultur, Bildung und Arbeit, Europa und Welt) + Bundesland |
| **Mock exam** | 33 random questions (30 general + 3 state), scored at the end |
| **Cheatsheet** | Built-in timeline and key facts for quick memorization |
| **State selector** | Choose your Bundesland in the Overview tab; persisted in localStorage |
| **Progress tracking** | Correct / incorrect / skipped counts saved across sessions |
| **PWA** | Works offline, installable on home screen |

## Real test facts

- **460 questions** in the official catalogue — 300 general plus 160 state-specific (10 for each of the 16 Bundesländer)
- **33 questions** per exam (30 general + 3 state-specific)
- **17 correct** answers needed to pass (~52 %)

## Project structure

```text
index.html          ← single-page app shell
css/style.css       ← dark-theme styles
js/
  app.js            ← entry point / wiring
  state.js          ← localStorage state management
  nav.js            ← bottom-tab navigation
  practice.js       ← practice mode logic
  exam.js           ← mock exam logic
  overview.js       ← stats + state selector
  glossary.js       ← cheatsheet content
  data/
    questions.js    ← 300 general + 160 state-specific questions
images/
  questions/        ← question images
  Bildnachweis.md   ← image sources, authors and licences
manifest.json       ← PWA manifest
sw.js               ← service worker (offline cache)
icons/              ← app icons
```

## Deploy

No build step — any static host works:

```sh
python3 -m http.server 8000   # local preview
vercel --prod                 # or deploy to Vercel
```

## Licence

Dual-licensed by content type, because different parts are useful to different
people under different terms.

| Part | Files | Licence |
| --- | --- | --- |
| **Software** | `index.html`, `css/`, `js/` (except `js/data/`), `sw.js`, `manifest.json` | [MIT](LICENSE) |
| **Own content** | English translations, category mapping, cheatsheet, UI copy, the ballot illustration, and the image composites assembled here | [CC BY-SA 4.0](LICENSE-CONTENT) |
| **Question catalogue** | the German question and answer texts | **Not licensed here** — see below |
| **Images** | `images/questions/` | Per-image credits in [Bildnachweis.md](images/Bildnachweis.md) |

### The question catalogue is not ours to license

The German questions come from the official catalogue published as **Anlage 1
to the Einbürgerungstestverordnung** — a statutory instrument. Under §5 UrhG,
official works published for public information fall outside copyright
protection, so the catalogue may be used and redistributed freely. It is
included here word for word, unmodified, and no permission from this repository
is needed to use it. If you want it, take it from BAMF directly:

- Catalogue: https://www.gesamtfragenkatalog.de/ and https://oet.bamf.de/
- Ordinance: https://www.gesetze-im-internet.de/einbtestv/anlage_1.html

### Trademarks and affiliation

"Einbürgerungstest", "Leben in Deutschland" and "BAMF" refer to the official
test and the Bundesamt für Migration und Flüchtlinge. This project is
**unofficial** and is not affiliated with, endorsed by, or sponsored by BAMF.
See [NOTICE](NOTICE).

### Images

Sources, authors and licences for every question image are recorded in
[`images/Bildnachweis.md`](images/Bildnachweis.md): public domain for the
coats of arms and flag, CC BY-SA for the two base maps and the two
photographs, and two illustrations drawn for this project.

Three catalogue questions are illustrated with period press photographs that
remain in copyright. Since no freely licensed picture of those scenes exists,
the images were removed rather than replaced with something that would
contradict the question text — those questions are answered from the text
alone. The Bildnachweis records which.

### Third parties

No third-party libraries, fonts or datasets are bundled. One runtime request is
made: a cookieless GoatCounter page-view counter (self-hosted endpoint,
aggregate path only) — no cookies, no personal data, no cross-site tracking.
Delete the script tag in `index.html` if you fork and don't want it. All user
progress lives in `localStorage` on your own device.

## Contributing

Contributions are accepted under the same split — code as MIT, own content as
CC BY-SA 4.0. By opening a pull request you agree to license your contribution
accordingly. Corrections to question text, translations and the cheatsheet are
as welcome as code changes.
