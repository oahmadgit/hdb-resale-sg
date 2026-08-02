const { AppError } = require('../middleware/errorHandler');

function createAffordabilityController({ affordabilityService }) {
  async function getAffordability(req, res, next) {
    const { income, savings, towns, flatType, tenure, rate } = req.validated;

    try {
      const result = await affordabilityService.calculate({
        income,
        savings,
        towns,
        flatType,
        tenure,
        rate,
      });
      res.status(200).json(result);
    } catch (err) {
      next(new AppError('Failed to fetch resale data upstream', 500, 'UPSTREAM_ERROR'));
    }
  }

  return { getAffordability };
}

module.exports = { createAffordabilityController };
