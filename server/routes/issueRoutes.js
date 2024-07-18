const express = require('express');
const router = express.Router();
const cors = require('cors');

const { submitIssue, fetchIssues, acceptIssue, rejectIssue } = require('../controllers/issueController');

router.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173', // Replace with your frontend origin
  })
);

router.post('/submit-issue', submitIssue);
router.get('/fetch-issues/:serviceProviderId/:lat/:lng', fetchIssues);
router.post('/accept-issue/:id', acceptIssue);
router.post('/reject-issue/:issueId/:serviceProviderId', rejectIssue);

// Global error handler
router.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = router;
