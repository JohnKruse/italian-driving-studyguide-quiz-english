# Quiz Patente A/B — Trick Heuristics, Trap Badges & Native English Integration Plan

**Target Repository:** `quiz-patente-ab` (`feat/trick-heuristics-and-en-translations` branched from `main` @ `b08e793`)  
**Source Analytics Repository:** `Italian_drivers_lic_question_gathering_2026`  
**Corpus Alignment:** Verified **6,963 / 6,963 (100%)** exact match on `id` and `question` text (`src/services/questions.json`), plus **1,381 / 1,381 (100%)** match on theory hints (`src/services/hints.json`). Zero ID reconciliation required.

---

## 1. Objectives & Design Principles

1. **Spoiler-Free Trick Warning Pre-Answer:** Give the learner an optional visual signal (`⚠️ Trap`) on the **1,020** highest-risk questions (`14.6%` of the bank) to trigger careful reading—without leaking whether the statement is `VERO` or `FALSO` or revealing `anti_heuristic_flag` exceptions beforehand.
2. **2-Step Practice Flip Card:** Replace the current immediate auto-skip on correct answers (`Domanda.jsx`) with an **Answer → Reveal → Next** flow in Practice mode so associated statistical heuristics, rule-exception alerts, bilingual trap explanations, and opposite-answer twins appear immediately after answering.
3. **Domain-Accurate Built-In English Translations:** Integrate `claude-haiku-5.5` micro-batch translations for all **6,963 questions** and **1,381 theory hints**, preserving *Codice della Strada* legal distinctions (`fermata` ≠ `sosta`, `ciclomotore` ≠ `motociclo`, `carreggiata` ≠ `corsia`) so external browser translation extensions are unnecessary.
4. **Targeted Drilling & Mock Exam Integrity:** Add a composable **Traps Only** practice filter (`1,020` items) while keeping **Mock Test** mode authentic (no mid-exam badges or spoilers), moving the full heuristic/explanation review to the post-exam completion screen.
5. **Fast Initial Bundle:** Keep Vite's startup bundle slim (`~25 KB` gzip index) by lazy-loading explanations and English text per chapter (`ch-01.json`..`ch-25.json`).

---

## 2. Architecture & Data Packaging Pipeline

The merged analytics file (`output/question_analytics.json`) is ~25 MB raw. Instead of bundling it directly into JS:

### Export Script (`Italian_drivers_lic_question_gathering_2026/src/analysis/export_simulator_assets.py`)
Generates static JSON artifacts into `quiz-patente-ab` (Netlify/Vite static compatible, zero backend):

| Output File (in `quiz-patente-ab`) | Approx. Size | Contents | Loading Strategy |
| :--- | :--- | :--- | :--- |
| `src/services/trick-index.json` | ~162 KB raw (~25 KB gzip) | Map `id -> [tierCode, score, antiHeuristicFlag, blindWrongFlag, humanRiskCode]` for all 6,963 IDs | Bundled at startup for instant O(1) `⚠️ Trap` badge lookup and `Traps Only` filtering |
| `src/services/cues-meta.json` | ~15 KB raw | Trigger phrase -> `{ p_vero, p_falso, n, lean, playbook_slug }` from `analysis_summary.json` | Bundled at startup |
| `public/analytics/ch-01.json` … `ch-25.json` | ~85–110 KB gzip per chapter | Per-chapter map `id -> { question_en, matched_cues, anti_heuristic, score, tier, trap_tags, human_risk, blind_correct, exp_it, exp_en, tip_it, tip_en, opp_id, sign_it, sign_en }` | Lazy `fetch('/analytics/ch-XX.json')` on demand + in-memory `Map` cache |
| `public/analytics/hints-en.json` | ~95 KB gzip | Map `hint_id -> { title_en, description_en }` for all 1,381 theory hints from `output/hints_en.json` | Lazy `fetch('/analytics/hints-en.json')` once when a hint opens |

### Client Cache Service (`src/services/get-analytics.js`)
* Exports synchronous `getTrickMeta(id)` (reads `trick-index.json`) and `getCueMeta(phrase)` (reads `cues-meta.json`).
* Exports async `loadQuestionDetails(id, idChapter)` and `loadHintTranslation(theoryId)` backed by module-level `Promise`/`Map` caches, with clean fallback (`null`) if offline/unavailable so quiz flow never blocks.

---

## 3. UI & UX Changes by File

### 3.1 `src/components/QuizPage.jsx` + `src/services/pick-domanda.js`
* **Top Toolbar Controls (Practice Mode):**
  1. **`Show trap icon` switch** (`localStorage` key `patente.showTrapIcon`, default `true` in Practice, **forced `false` during Mock Exam**).
  2. **`Traps only` filter pill** next to `ArgomentoPicker` (`localStorage` optional or session state; hidden/inactive in Mock Exam). Drills only questions where `trickIndex[id][0] === 't'` (`1,020` items total), composable with `"All topics"` or any specific chapter.
     * Guard `pickDomanda(id_argomento = null, { trapsOnly = false } = {})` cleanly when a chapter filter has fewer traps, falling back safely with a toast if zero match.
     * Note `getDomande(id_argomento)` already treats `Number(null) === 0` as "all chapters".
  3. **Language Mode segmented toggle (`IT` | `Peek` | `IT + EN`):** persisted in `localStorage` (`patente.langMode`, default `'peek'`).
* **Mock Test Mode (`mode === 'mock'`):**
  * During active 30-question exam: hide `⚠️ Trap` badge, hide `Traps only`, and preserve automatic advancement with no mid-exam answer spoilers.
  * Track full missed question records (`missedQuestions`) alongside `errate` IDs so the **Mock test completed!** screen renders a scrollable review list showing each missed question's IT+EN text, your choice vs official answer, matched heuristic cues/exception alerts, and bilingual Layer 3 explanation + study tip.

### 3.2 `src/components/Domanda/Domanda.jsx`
* **Pre-Answer Card View:**
  * Beside `Domanda: {id}`, render a compact amber/red Chakra `Badge` with `FiAlertTriangle` (`⚠️ Trap`) strictly when `showTrapIcon && !isMock && trickMeta?.tier === 't'`.
  * **Zero pre-answer spoilers:** Never show `anti_heuristic`, `matched_cues`, `trap_tags`, or `VERO`/`FALSO` probabilities before the user answers.
  * **Question Translation Display:**
    * `IT`: Italian sentence only.
    * `Peek` *(default)*: Italian sentence + subtle **`Show EN` (`T`)** button that toggles `question_en` inline; auto-expands once the question is answered.
    * `IT + EN`: `question_en` rendered permanently beneath the Italian text in smaller muted typography.
* **Post-Answer 2-Step Flip Flow (Practice Mode):**
  * Replace direct `onSuccess()` auto-advance with `answeredChoice` (`null | 0 | 1`) local state reset cleanly when `id` changes.
  * On clicking **Falso** (`0`) or **Vero** (`1`):
    * Lock answer buttons, highlight selected answer and ground truth (green = correct, red = wrong), call `onError(id)` once on miss, and increment tracking cleanly when moving to **`Prossima domanda →`** (`Next`, bound to `Enter` / `Space`).
    * Optional secondary toggle (`Auto-skip easy correct`) can be considered later, keeping explicit 2-step flip as default so the heuristic card is consistently visible.
  * Render the **Heuristic & Trap Card** directly below the action buttons (progressive disclosure—render sections only when applicable):
    1. **Header Strip:** Verdict (`VERO` / `FALSO`), combined score (`score/100`), `human_risk` pill, and non-`straightforward_rule` `trap_tags` badges.
    2. **Associated Statistical Heuristic *(shown if `matched_cues.length > 0` or `anti_heuristic`)*:**
       * For each cue in `matched_cues`, show observed direction & sample size from `cues-meta.json` (e.g., `"in ogni caso" -> 90.5% FALSO (n=21)`) plus a deep link to the Playbook section.
       * When `anti_heuristic === true` (`265` exceptions): highlight with a distinct purple/orange **Rule Exception** callout explaining that this item breaks the usual trigger-word lean.
    3. **Bilingual Explanation & Study Tip *(all items)*:** Render `exp_it` + `exp_en` and `tip_it` + `tip_en` (IT paragraph first, EN immediately below).
    4. **Expandable "Opposite Twin (`#opp_id`)" *(when `opp_id` exists — `6,600` items)*:** Fetches/reads the twin's Italian text from `src/services/questions.json` and its English translation from the chapter analytics cache, displaying both side-by-side so the exact minimal-pair word change stands out.
    5. **Visual Asset Label *(when `image > 0`)*:** Display `sign_it` / `sign_en` post-flip. On Chapter 14 intersection diagrams where `blind_correct === false`, include a short note reminding the learner to verify priority trajectories directly in the figure.

### 3.3 `src/components/Hint/Hint.jsx`
* Keep immediate Italian hint rendering via `getHint(theory)`.
* Asynchronously load `public/analytics/hints-en.json` via `loadHintTranslation(theory)`.
* Convert `<br />` sequences in Italian descriptions safely into clean paragraph/list blocks (removing raw HTML injection risk) and render `title_en` + newline-split `description_en` directly below each Italian block (respecting the active language setting, or always bilingual inside the modal).

### 3.4 Standalone Docs, Splash & Chapter Heading Sync
* **`src/services/normalize-domanda.js` & `src/services/get-argomento.js`:** Resolve chapter titles from `chapterTranslations` in `src/i18n/chapters.js` instead of the misaligned legacy labels in `src/services/chapters.json` (fixing 16/25 mismatched headers such as Ch 6–10 and Ch 15–25).
* **`scripts/build-standalone-guide.mjs`:** Extend to compile our generated bilingual references alongside the existing Study Guide:
  * `docs/patente-heuristics-playbook.md` -> `public/docs/patente-heuristics-playbook.html`
  * `docs/patente-glossary.md` -> `public/docs/patente-glossary.html`
* **`src/App.jsx`:** Add header/splash quick links to **Playbook ↗** and **Glossary ↗**, and update the splash description to reflect native English Q&A translations built directly into Practice mode.

---

## 4. Phased Implementation & Verification Plan

| Phase | Scope | Verification Gate |
| :--- | :--- | :--- |
| **Phase 1: Data & Translation Completion** *(Complete)* | Complete full 6,963-question + 1,381-hint `claude-haiku-5.5` translation pass with QA audit; verify `git` sync & create branch `feat/trick-heuristics-and-en-translations`. | `6,963` questions + `1,381` hints translated; `0` empty fields; `0` raw HTML tags in hints; `pytest` passes (143/143). |
| **Phase 2: Asset Export & Data Layer** *(Complete)* | Add `export_simulator_assets.py`; write `trick-index.json`, `cues-meta.json`, `ch-01..25.json`, `hints-en.json`; implement `get-analytics.js`, updated `pick-domanda.js`, and `normalize-domanda.js`. | Export verification script confirms 100% ID coverage and gzip budgets; `scripts/analytics-integration.test.mjs` and `npm run mock:test` pass. |
| **Phase 3: UI Integration & Standalone Docs** *(Complete)* | Update `QuizPage.jsx`, `Domanda.jsx`, `Hint.jsx`, `App.jsx`, `TrapInsightsCard.jsx`, `build-standalone-guide.mjs`. | Integrated spoiler-free pre-answer rendering, 2-step flip card, `IT`/`Peek`/`IT+EN` toggle, Hint modal, Mock Exam completion review, and standalone Playbook/Glossary HTML builds (`npm run build` succeeds). |
| **Phase 4: End-to-End Verification** *(Next — after workspace switch)* | Live browser verification against Vite dev/preview server. | Verify `⚠️ Trap` badge toggle, `Traps only` filter, post-flip heuristic/exception card, Opposite Twin comparison, bilingual Hint modal, and spoiler-free Mock Exam flow visually and with zero console/network errors. |

---

## 5. Workspace Transfer & Next Steps

* **Completed & Pushed (`feat/trick-heuristics-and-en-translations`):** Phases 1–3 are complete, tested (`scripts/analytics-integration.test.mjs`, `npm run mock:test`), built (`npm run build`), and pushed to `origin/feat/trick-heuristics-and-en-translations` (including `.gitignore` negation rules overriding global `*.json` ignores for `src/services/*.json` and `public/analytics/*.json`).
* **Remaining Work Upon Switching to `quiz-patente-ab`:**
  1. Run Phase 4 live browser E2E verification (`npm run dev` / `npm run preview`) across Practice mode (`IT` / `Peek` / `IT + EN`, `⚠️ Trap` badge, `Traps only` filter, 2-step flip card, Opposite Twin, bilingual Hint modal, Playbook/Glossary links) and Mock Exam mode.
  2. Apply any visual or UX polish identified during live testing.
  3. Merge `feat/trick-heuristics-and-en-translations` into `main` and push `main` to trigger deployment.
