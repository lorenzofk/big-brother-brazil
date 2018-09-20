var express = require('express');
var router = express.Router();
var pollController = require('../controllers/poll-controller');

router.post('/:id/:participantId', pollController.vote);

module.exports = router;