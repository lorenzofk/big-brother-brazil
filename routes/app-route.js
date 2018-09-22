var express = require('express');
var router = express.Router();
var appController = require('../controllers/app-controller');

router.get('/', appController.index);

module.exports = router;