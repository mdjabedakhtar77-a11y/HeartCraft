/**
 * Money formatting & fixed pricing utility
 * Enforces server-side NPR 5.00 rules.
 */

const FIXED_PRICE_NPR = 5.00;

function formatCurrency(amount) {
  return Number(amount || FIXED_PRICE_NPR).toFixed(2);
}

module.exports = {
  FIXED_PRICE_NPR,
  formatCurrency
};
