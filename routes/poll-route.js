var express = require('express');
var router = express.Router();
var pollController = require('../controllers/poll-controller');

// Routes used by tests
router.post('/:id/:participantId', pollController.vote);

// Routes used in web app to render views and compute votes
router.post('/', pollController.voteByHuman);
router.get('/:id', pollController.showElimination);

module.exports = router;