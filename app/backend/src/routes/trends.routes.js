const { Router } = require('express');

const router = Router();

// Controller wired up in Phase 3.
router.get('/', (_req, res) => {
  res.status(501).json({ error: { message: 'Not implemented yet', code: 'NOT_IMPLEMENTED' } });
});

module.exports = router;
