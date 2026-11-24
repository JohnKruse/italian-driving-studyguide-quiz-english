import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');
const require = createRequire(import.meta.url);
const esbuild = require(join(ROOT, 'node_modules', 'esbuild'));

async function importBundledModule(entryRelPath) {
  const result = await esbuild.build({
    entryPoints: [join(ROOT, entryRelPath)],
    bundle: true,
    format: 'esm',
    platform: 'node',
    write: false,
  });
  const tmpDir = mkdtempSync(join(tmpdir(), 'quiz-patente-test-'));
  const tmpFile = join(tmpDir, 'bundle.mjs');
  writeFileSync(tmpFile, result.outputFiles[0].text, 'utf-8');
  try {
    return await import(pathToFileURL(tmpFile).href);
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
}

test('exported analytics assets match all 6,963 questions and 1,381 hints with zero missing fields', () => {
  const questions = JSON.parse(readFileSync(join(ROOT, 'src/services/questions.json'), 'utf-8'));
  const hints = JSON.parse(readFileSync(join(ROOT, 'src/services/hints.json'), 'utf-8'));
  const trickIndex = JSON.parse(readFileSync(join(ROOT, 'src/services/trick-index.json'), 'utf-8'));
  const cuesMeta = JSON.parse(readFileSync(join(ROOT, 'src/services/cues-meta.json'), 'utf-8'));
  const hintsEn = JSON.parse(readFileSync(join(ROOT, 'public/analytics/hints-en.json'), 'utf-8'));

  assert.equal(Object.keys(trickIndex).length, 6963);
  const trapCount = Object.values(trickIndex).filter((row) => row[0] === 't').length;
  const antiCount = Object.values(trickIndex).filter((row) => row[2] === 1).length;
  assert.equal(trapCount, 1020);
  assert.equal(antiCount, 264);

  const seenQuestionIds = new Set();
  const usedCues = new Set();
  for (let ch = 1; ch <= 25; ch += 1) {
    const padded = String(ch).padStart(2, '0');
    const chunkPath = join(ROOT, `public/analytics/ch-${padded}.json`);
    assert.ok(existsSync(chunkPath), `Missing chunk ${chunkPath}`);
    const chunk = JSON.parse(readFileSync(chunkPath, 'utf-8'));
    for (const [sid, rec] of Object.entries(chunk)) {
      seenQuestionIds.add(Number(sid));
      assert.ok(rec.question_en && rec.question_en.trim().length > 0, `Empty question_en on ${sid}`);
      assert.ok(rec.exp_it && rec.exp_it.trim().length > 0, `Empty exp_it on ${sid}`);
      assert.ok(rec.exp_en && rec.exp_en.trim().length > 0, `Empty exp_en on ${sid}`);
      assert.ok(rec.tip_it && rec.tip_it.trim().length > 0, `Empty tip_it on ${sid}`);
      assert.ok(rec.tip_en && rec.tip_en.trim().length > 0, `Empty tip_en on ${sid}`);
      for (const cue of rec.matched_cues) {
        usedCues.add(cue);
      }
    }
  }

  assert.equal(seenQuestionIds.size, questions.length);
  for (const q of questions) {
    assert.ok(seenQuestionIds.has(Number(q.id)), `Missing analytics for question ${q.id}`);
  }
  for (const cue of usedCues) {
    assert.ok(cue in cuesMeta, `Missing cues-meta entry for '${cue}'`);
  }

  assert.equal(Object.keys(hintsEn).length, hints.length);
  const htmlTagRegex = /<[a-zA-Z/][^>]*>/;
  for (const h of hints) {
    const rec = hintsEn[String(h.id)];
    assert.ok(rec && rec.description_en.trim().length > 0, `Missing hint EN description for ${h.id}`);
    assert.ok(!htmlTagRegex.test(rec.description_en), `Raw HTML tag leaked in hint ${h.id}`);
  }
});

test('pick-domanda, normalize-domanda, and get-analytics services handle filtering, verified chapters, and lazy fetch', async () => {
  const analyticsMod = await importBundledModule('src/services/get-analytics.js');
  const pickMod = await importBundledModule('src/services/pick-domanda.js');
  const normalizeMod = await importBundledModule('src/services/normalize-domanda.js');

  const pickDomanda = pickMod.default;
  const normalizeDomanda = normalizeMod.default;

  assert.equal(pickMod.countMatchingDomande(null, { trapsOnly: true }), 1020);
  assert.equal(pickMod.countMatchingDomande(24, { trapsOnly: true }), 0);
  assert.equal(pickDomanda(24, { trapsOnly: true }), null);

  for (let i = 0; i < 20; i += 1) {
    const trapItem = pickDomanda(null, { trapsOnly: true });
    assert.ok(trapItem);
    assert.equal(analyticsMod.isTrapQuestion(trapItem.id), true);
  }

  // Verified chapter titles override legacy misaligned chapters.json
  const ch6Norm = normalizeDomanda({ id: 99991, id_chapter: 6, image: 0, question: 'Test', answer: 1, theory: 1 });
  const ch15Norm = normalizeDomanda({ id: 99992, id_chapter: 15, image: 12, question: 'Test', answer: 1, theory: 1 });
  const ch25Norm = normalizeDomanda({ id: 99993, id_chapter: 25, image: 0, question: 'Test', answer: 1, theory: 1 });
  assert.equal(ch6Norm.argomento, 'Segnaletica orizzontale');
  assert.equal(ch6Norm.argomento_en, 'Road markings');
  assert.equal(ch15Norm.argomento, 'Norme sul sorpasso');
  assert.equal(ch15Norm.image, '012');
  assert.equal(ch25Norm.argomento, 'Elementi costitutivi del veicolo importanti per la sicurezza');

  const cueInOgniCaso = analyticsMod.getCueMeta('in ogni caso');
  assert.equal(cueInOgniCaso.direction, 'FALSO');
  assert.equal(cueInOgniCaso.count, 21);

  // Lazy load integration test via mocked fetch reading public/analytics files
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    const rel = String(url).replace(/^\//, '');
    const text = readFileSync(join(ROOT, 'public', rel), 'utf-8');
    return { ok: true, status: 200, json: async () => JSON.parse(text) };
  };
  try {
    const q10Details = await analyticsMod.loadQuestionDetails(10, 1);
    assert.ok(q10Details.question_en.toLowerCase().includes('overtaking'));
    const h1 = await analyticsMod.loadHintTranslation(1);
    assert.equal(h1.title_en, 'Road');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('standalone built playbook and glossary HTML exist and contain all cue anchor IDs', () => {
  const playbookHtmlPath = join(ROOT, 'public/docs/patente-heuristics-playbook.html');
  const glossaryHtmlPath = join(ROOT, 'public/docs/patente-glossary.html');
  assert.ok(existsSync(playbookHtmlPath), 'Missing public/docs/patente-heuristics-playbook.html');
  assert.ok(existsSync(glossaryHtmlPath), 'Missing public/docs/patente-glossary.html');

  const playbookHtml = readFileSync(playbookHtmlPath, 'utf-8');
  const cuesMeta = JSON.parse(readFileSync(join(ROOT, 'src/services/cues-meta.json'), 'utf-8'));
  const anchors = new Set(Object.values(cuesMeta).map((entry) => entry.anchor));
  for (const anchor of anchors) {
    assert.ok(
      playbookHtml.includes(`id="${anchor}"`),
      `Playbook HTML missing heading anchor id="${anchor}"`,
    );
  }
});
