var express = require('express');
var router = express.Router();
var appController = require('../controllers/app-controller');

router.get('/', appController.index);
router.get('/loaderio-c206be629e08a69f527bfb7c162f1b14', function (req, res) {
    res.sendFile('/files/verification_file.txt', {root: './public'});
});

module.exports = router;