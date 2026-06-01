# Einbürgerungstest – Lern-PWA 🇩🇪

A Progressive Web App to help prepare for the German naturalization test (**Einbürgerungstest / Leben in Deutschland**).

**Live:** deploy with Vercel — just connect the repo, no build step needed (static files).

## Features

| Feature | Details |
|---|---|
| **Practice mode** | All 300 general questions + 10 state-specific, with instant feedback |
| **Unknown filter** | Focus on unknown cards until they are answered correctly |
| **Category filter** | BAMF's 10 official categories (Recht, Politik, Staat, Bund und Länder, Geschichte, Gesellschaft und Familie, Wirtschaft, Religion und Kultur, Bildung und Arbeit, Europa und Welt) + Bundesland |
| **Mock exam** | 33 random questions (30 general + 3 state), scored at the end |
| **Cheatsheet** | Built-in timeline and key facts for quick memorization |
| **State selector** | Choose your Bundesland in the Overview tab; persisted in localStorage |
| **Progress tracking** | Correct / incorrect / skipped counts saved across sessions |
| **PWA** | Works offline, installable on home screen |

## Real test facts

- **310 questions** in the official BAMF catalog (300 general + 10 per state)
- **33 questions** per exam (30 general + 3 state-specific)
- **17 correct** answers needed to pass (~52 %)

## Project structure

```
index.html          ← single-page app shell
css/style.css       ← dark-theme styles
js/
  app.js            ← entry point / wiring
  state.js          ← localStorage state management
  nav.js            ← bottom-tab navigation
  practice.js       ← practice mode logic
  exam.js           ← mock exam logic
  overview.js       ← stats + state selector
  data/
    questions.js    ← 300 general + 160 state-specific questions
manifest.json       ← PWA manifest
sw.js               ← service worker (offline cache)
icons/              ← app icons
```

## Deploy to Vercel

```bash
# No build step required
vercel --prod
```
