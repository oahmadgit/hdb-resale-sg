import { describe, it, expect } from 'vitest';
import { formatCurrency, formatPercent, formatMonth } from '../../src/utils/formatters';

describe('formatCurrency', () => {
  it('formats a number as SGD currency with no decimals', () => {
    expect(formatCurrency(520000)).toBe('$520,000');
  });

  it('rounds to the nearest dollar', () => {
    expect(formatCurrency(1842.6)).toBe('$1,843');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0');
  });

  it('returns a placeholder for null/undefined', () => {
    expect(formatCurrency(null)).toBe('—');
    expect(formatCurrency(undefined)).toBe('—');
  });
});

describe('formatPercent', () => {
  it('formats a ratio as a percentage with one decimal', () => {
    expect(formatPercent(0.337)).toBe('33.7%');
  });

  it('formats a negative ratio with a leading minus', () => {
    expect(formatPercent(-0.05)).toBe('-5.0%');
  });

  it('formats zero', () => {
    expect(formatPercent(0)).toBe('0.0%');
  });

  it('returns a placeholder for null/undefined', () => {
    expect(formatPercent(null)).toBe('—');
    expect(formatPercent(undefined)).toBe('—');
  });
});

describe('formatMonth', () => {
  it('formats a YYYY-MM string into a readable month/year', () => {
    expect(formatMonth('2024-03')).toBe('Mar 2024');
  });

  it('returns a placeholder for an empty value', () => {
    expect(formatMonth(null)).toBe('—');
    expect(formatMonth('')).toBe('—');
  });
});
