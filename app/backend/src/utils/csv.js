function parseCsv(content) {
  const lines = content.split('\n').filter((line) => line.trim().length > 0);
  if (lines.length === 0) return [];

  const headers = lines[0].replace(/\r$/, '').split(',');
  const rows = lines.slice(1);

  return rows.map((line) => {
    const values = line.replace(/\r$/, '').split(',');
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });
    return row;
  });
}

module.exports = { parseCsv };
