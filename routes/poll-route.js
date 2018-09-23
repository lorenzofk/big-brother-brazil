var express = require('express');
var router = express.Router();
var pollController = require('../controllers/poll-controller');

router.use(function (req, res, next) {
    next();
});

router.post('/', pollController.voteByHuman);
router.get('/:id', pollController.showElimination);
router.post('/:id/:participantId', pollController.vote);


module.exports = router;