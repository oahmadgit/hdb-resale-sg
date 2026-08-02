const { median, percentile } = require('../../src/utils/math');

describe('median', () => {
  it('returns the middle value for an odd-length array', () => {
    expect(median([100, 200, 300])).toBe(200);
  });

  it('averages the two middle values for an even-length array', () => {
    expect(median([100, 200])).toBe(150);
  });

  it('does not require the input to be pre-sorted', () => {
    expect(median([300, 100, 200])).toBe(200);
  });

  it('returns the value itself for a single-element array', () => {
    expect(median([42])).toBe(42);
  });

  it('returns null for an empty array', () => {
    expect(median([])).toBeNull();
  });

  it('does not mutate the input array', () => {
    const input = [300, 100, 200];
    median(input);
    expect(input).toEqual([300, 100, 200]);
  });
});

describe('percentile', () => {
  it('returns the min for the 0th percentile', () => {
    expect(percentile([10, 20, 30, 40, 50], 0)).toBe(10);
  });

  it('returns the max for the 100th percentile', () => {
    expect(percentile([10, 20, 30, 40, 50], 100)).toBe(50);
  });

  it('returns the median for the 50th percentile', () => {
    expect(percentile([10, 20, 30, 40, 50], 50)).toBe(30);
  });

  it('interpolates between values for non-exact ranks', () => {
    expect(percentile([10, 20, 30, 40], 50)).toBe(25);
  });

  it('returns null for an empty array', () => {
    expect(percentile([], 50)).toBeNull();
  });

  it('throws for a percentile outside 0-100', () => {
    expect(() => percentile([1, 2, 3], 150)).toThrow();
    expect(() => percentile([1, 2, 3], -1)).toThrow();
  });
});
