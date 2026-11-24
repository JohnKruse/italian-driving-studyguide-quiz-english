import trickIndex from './trick-index.json';
import cuesMeta from './cues-meta.json';
import questions from './questions.json';

const TIER_NAME_MAP = {
  s: 'straightforward',
  m: 'moderate',
  t: 'trap',
};

const HUMAN_RISK_MAP = {
  l: 'low',
  m: 'medium',
  h: 'high',
};

const questionsById = new Map(
  questions.map((question) => [Number(question.id), question]),
);

const chapterAnalyticsPromises = new Map();
let hintsEnPromise = null;

export function getTrickMeta(id) {
  const row = trickIndex[String(Number(id))];
  if (!Array.isArray(row) || row.length < 5) {
    return null;
  }
  return {
    tier: TIER_NAME_MAP[row[0]] || 'straightforward',
    score: Number(row[1]) || 0,
    antiHeuristic: row[2] === 1,
    blindWrong: row[3] === 1,
    humanRisk: HUMAN_RISK_MAP[row[4]] || 'low',
  };
}

export function isTrapQuestion(id) {
  return getTrickMeta(id)?.tier === 'trap';
}

export function getCueMeta(phrase) {
  if (!phrase) {
    return null;
  }
  return cuesMeta[phrase] || null;
}

export function getQuestionById(id) {
  const numericId = Number(id);
  if (Number.isNaN(numericId) || numericId <= 0) {
    return null;
  }
  return questionsById.get(numericId) || null;
}

export async function loadChapterAnalytics(idChapter) {
  const ch = Number(idChapter);
  if (Number.isNaN(ch) || ch < 1 || ch > 25 || typeof fetch !== 'function') {
    return {};
  }

  if (!chapterAnalyticsPromises.has(ch)) {
    const padded = String(ch).padStart(2, '0');
    const pending = fetch(`/analytics/ch-${padded}.json`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .catch(() => {
        chapterAnalyticsPromises.delete(ch);
        return {};
      });
    chapterAnalyticsPromises.set(ch, pending);
  }

  return chapterAnalyticsPromises.get(ch);
}

export async function loadQuestionDetails(id, idChapter) {
  const chMap = await loadChapterAnalytics(idChapter);
  return chMap[String(Number(id))] || null;
}

export async function loadHintTranslation(theoryId) {
  const numericId = Number(theoryId);
  if (Number.isNaN(numericId) || numericId <= 0 || typeof fetch !== 'function') {
    return null;
  }

  if (!hintsEnPromise) {
    hintsEnPromise = fetch('/analytics/hints-en.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .catch(() => {
        hintsEnPromise = null;
        return {};
      });
  }

  const allHints = await hintsEnPromise;
  return allHints[String(numericId)] || null;
}
