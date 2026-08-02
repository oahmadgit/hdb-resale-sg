const fs = require('fs');
const path = require('path');
const { parseCsv } = require('../utils/csv');
const { normalizeRecord } = require('./resale.service');

function loadDataset(dataDir) {
  if (!fs.existsSync(dataDir)) {
    throw new Error(`Data directory not found: ${dataDir}`);
  }

  const csvFiles = fs.readdirSync(dataDir).filter((file) => file.endsWith('.csv'));

  const records = [];
  for (const file of csvFiles) {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
    for (const row of parseCsv(content)) {
      records.push(normalizeRecord(row));
    }
  }

  return records;
}

function createDatasetService({ dataDir }) {
  let cachedRecords = null;

  function getAllRecords() {
    if (!cachedRecords) {
      cachedRecords = loadDataset(dataDir);
    }
    return cachedRecords;
  }

  return { getAllRecords };
}

module.exports = { createDatasetService };
