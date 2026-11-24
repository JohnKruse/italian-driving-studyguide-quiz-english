import getDomande from './get-domande';
import normalizeDomanda from './normalize-domanda';
import { isTrapQuestion } from './get-analytics';

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function filterDomande(id_argomento = null, { trapsOnly = false } = {}) {
  const domande = getDomande(Number(id_argomento));
  if (!trapsOnly) {
    return domande;
  }
  return domande.filter((domanda) => isTrapQuestion(domanda.id));
}

export function countMatchingDomande(id_argomento = null, options = {}) {
  return filterDomande(id_argomento, options).length;
}

function pickDomanda(id_argomento = null, options = {}) {
  const pool = filterDomande(id_argomento, options);
  if (!pool.length) {
    return null;
  }
  return normalizeDomanda(pick(pool));
}

export default pickDomanda;
