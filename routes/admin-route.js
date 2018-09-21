var express = require('express');
var router = express.Router();
var adminController = require('../controllers/admin-controller');

router.get('/resultados/votos/:id', adminController.showResume);
router.get('/resultados/votos/:id/:participantId', adminController.showResumeByParticipant);
router.get('/resultados/votosPorHora/:id', adminController.showResumeByHour);

module.exports = router;