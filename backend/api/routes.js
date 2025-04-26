const express = require('express');
const router = express.Router();

router.get('/safety', (req, res) => {
  res.json({ message: 'Safety API endpoint' });
});

module.exports = router;