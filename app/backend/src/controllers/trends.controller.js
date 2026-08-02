const { AppError } = require('../middleware/errorHandler');
const { buildTrendsSeries } = require('../services/aggregation.service');

function createTrendsController({ resaleService }) {
  async function getTrends(req, res, next) {
    const { towns, flatType, from, to, storeyRange } = req.validated;

    try {
      const records = await resaleService.fetchAllRecords({
        town: towns,
        flat_type: flatType,
        storey_range: storeyRange,
      });

      const filtered = records.filter((r) => {
        if (from && r.month < from) return false;
        if (to && r.month > to) return false;
        return true;
      });

      res.status(200).json(buildTrendsSeries(filtered));
    } catch (err) {
      next(new AppError('Failed to fetch resale data upstream', 500, 'UPSTREAM_ERROR'));
    }
  }

  return { getTrends };
}

module.exports = { createTrendsController };
