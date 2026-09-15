const VALID_CATEGORIES = ['money', 'cloth'];

const normalizeSessionId = (sessionId) => {
  if (typeof sessionId !== 'string') {
    return '';
  }

  return sessionId.trim();
};

const isValidCategory = (category) => VALID_CATEGORIES.includes(category);

module.exports = {
  VALID_CATEGORIES,
  normalizeSessionId,
  isValidCategory
};
