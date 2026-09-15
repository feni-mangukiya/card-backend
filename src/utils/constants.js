const OPTION_MAP = {
  money: ['₹300', '₹400', '₹500', '₹600', '₹700'],
  cloth: ['T-Shirt', 'Shirt', 'Jeans', 'Socks', 'Shorts']
};

const ADMIN_STATS_DEFAULTS = {
  totalVisitors: 0,
  totalSpins: 0,
  completedSessions: 0,
  finalGiftSelections: 0
};

module.exports = {
  DEFAULT_OPTIONS: OPTION_MAP,
  ADMIN_STATS_DEFAULTS
};
