# Italian Driving License Study Guide and Quiz (English)

A study resource for English speakers preparing for the Italian Patente A/B driving theory exam. Built on top of the official 7,165-question database used in Italian driving schools.

---

## Standalone Study Guide

The most useful thing in this repository is a **comprehensive, self-contained study guide** that you can read in any web browser -- no installation or coding required.

**[Download the Study Guide (HTML)](docs/italian-drivers-license-study-guide.html)**

What it covers:

- All 25 exam chapters, from road definitions and traffic signs to insurance, environmental rules, and first aid.
- 196 official traffic sign images embedded directly in the guide.
- Italian terminology paired with English translations throughout (e.g., *carreggiata* = carriageway, *corsia* = lane).
- Exam strategy tips based on the patterns found across all 7,165 official questions.
- Sample true/false questions with explanations for each chapter.

To use it, download the `.html` file (or clone this repository) and open it in your browser. Everything is self-contained -- images, styles, and content are all in the single file.

---

## Interactive Quiz App

For active practice, this repository also includes a browser-based quiz application that lets you drill questions from the official database.

### Features

- **Practice mode** -- Select any of the 25 chapters to get randomized questions from that topic.
- **Mock exam mode** -- Take a simulated 30-question exam (one question per chapter plus five weighted toward commonly-missed topics). Scores and restart controls appear when finished.
- **Hints** -- A lightbulb button opens theory explanations when available for a question.
- **Traffic sign images** -- Questions display the relevant sign image when one exists in the dataset.
- **Bilingual topic labels** -- The chapter selector shows each topic in Italian with its English translation.
- **Light and dark mode** -- Responsive layout via Chakra UI.
- On-screen counters track your total attempts and mistakes per session.

### Tip: Real-Time English Translation of Quiz Questions

The quiz questions are in Italian. For inline English translations, install the **Immersive Translate** browser extension. It lets you toggle translations on and off and choose between translation engines (Google Translate, Microsoft Translator, and others). This is the recommended way to study the questions in both languages simultaneously.

---

## Quick Start (Running the Quiz Locally)

Requires **Node.js 18+**. Download it from [nodejs.org](https://nodejs.org/) if needed.

```bash
git clone https://github.com/JohnKruse/italian-driving-studyguide-quiz-english.git
cd italian-driving-studyguide-quiz-english
npm install
npm run dev
```

Open the URL printed in the terminal (default: `http://localhost:5173`).

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Create the production bundle in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run build:guide` | Regenerate the standalone HTML study guide |
| `npm run mock:test` | Smoke-check the mock test configuration |

---

## Building the Study Guide

The standalone HTML study guide can be regenerated from its Markdown source:

```bash
npm run build:guide
```

This converts `docs/italian-drivers-license-study-guide.md` into a single self-contained `.html` file with all images and styles embedded. Run this after making any edits to the Markdown source.

---

## Deployment

The quiz app can be deployed to any static hosting provider. Build the production bundle with `npm run build` and upload the contents of the `dist/` directory. Netlify, Vercel, GitHub Pages, and similar services all work.

---

## Credits

The quiz engine and official question database are from [avalla/quiz-patente-ab](https://github.com/avalla/quiz-patente-ab). This fork adds the English-language study guide, bilingual chapter labels, mock exam mode, and other enhancements for English-speaking learners.

---

## License

See the original repository for license terms governing the quiz engine and question data.
