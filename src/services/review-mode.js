export const REVIEW_MODE_ALWAYS = 'always';
export const REVIEW_MODE_WRONG_ONLY = 'wrong-only';

/**
 * Normalizes a persisted or incoming review-mode value to a supported option.
 */
export function normalizeReviewMode(value, fallback = REVIEW_MODE_ALWAYS) {
  if (value === REVIEW_MODE_WRONG_ONLY || value === REVIEW_MODE_ALWAYS) {
    return value;
  }
  return fallback;
}

/**
 * Determines whether Practice mode should stay on the card to show post-answer
 * reasoning or immediately advance to the next question.
 */
export function shouldShowReasoningAfterAnswer({
  isMock = false,
  reviewMode = REVIEW_MODE_ALWAYS,
  isCorrect,
}) {
  if (isMock) {
    return false;
  }
  if (normalizeReviewMode(reviewMode) === REVIEW_MODE_WRONG_ONLY && isCorrect === true) {
    return false;
  }
  return true;
}
