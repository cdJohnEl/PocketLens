import { formatCurrency, formatCurrencyShort } from '../lib/currency';

describe('Currency utils', () => {
  it('formats NGN correctly', () => {
    expect(formatCurrency(1000, 'NGN')).toMatch(/₦/);
  });
  it('formats USD correctly', () => {
    expect(formatCurrency(100, 'USD')).toMatch(/\$/);
  });
  it('formats short currency', () => {
    expect(formatCurrencyShort(1000, 'USD', 2)).toMatch(/\$/);
  });
});
