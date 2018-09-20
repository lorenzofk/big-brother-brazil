var express = require('express');
var router = express.Router();
var adminController = require('../controllers/admin-controller');

router.get('/resultados/votos/:id', adminController.showResume);

module.exports = router;