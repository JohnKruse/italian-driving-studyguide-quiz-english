import getArgomento from './get-argomento';
import chapterTranslations from '../i18n/chapters';

function padImageCode(image) {
  const numeric = Number(image);
  if (Number.isNaN(numeric) || numeric <= 0) {
    return '';
  }
  return String(numeric).padStart(3, '0');
}

function normalizeDomanda(domanda) {
  if (!domanda) {
    return null;
  }

  const argomento = getArgomento(domanda.id_chapter) || {};
  const verifiedChapter = chapterTranslations[Number(domanda.id_chapter)] || {};

  return {
    ...domanda,
    image: padImageCode(domanda.image),
    argomento: verifiedChapter.it || argomento.descrizione || '',
    argomento_en: verifiedChapter.en || '',
  };
}

export default normalizeDomanda;
