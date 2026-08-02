const { parseCsv } = require('../../src/utils/csv');

describe('parseCsv', () => {
  it('parses a header row and data rows into an array of objects', () => {
    const content = 'month,town,resale_price\n2017-01,BEDOK,480000\n2017-02,TAMPINES,500000';

    expect(parseCsv(content)).toEqual([
      { month: '2017-01', town: 'BEDOK', resale_price: '480000' },
      { month: '2017-02', town: 'TAMPINES', resale_price: '500000' },
    ]);
  });

  it('returns an empty array for a header-only file', () => {
    expect(parseCsv('month,town,resale_price')).toEqual([]);
  });

  it('handles trailing newlines and skips blank lines', () => {
    const content = 'month,town\n2017-01,BEDOK\n\n2017-02,TAMPINES\n';
    expect(parseCsv(content)).toEqual([
      { month: '2017-01', town: 'BEDOK' },
      { month: '2017-02', town: 'TAMPINES' },
    ]);
  });

  it('normalizes CRLF line endings', () => {
    const content = 'month,town\r\n2017-01,BEDOK\r\n2017-02,TAMPINES\r\n';
    expect(parseCsv(content)).toEqual([
      { month: '2017-01', town: 'BEDOK' },
      { month: '2017-02', town: 'TAMPINES' },
    ]);
  });

  it('trims a trailing carriage return left on each field when CRLF splitting missed it', () => {
    const content = 'a,b\r\n1,2\r\n';
    const [row] = parseCsv(content);
    expect(row.b).toBe('2');
  });
});
