var express = require('express');
var router = express.Router();
var adminController = require('../controllers/admin-controller');

// Routes used to returns summaries
router.get('/resultados/votos/:id', adminController.showResume);
router.get('/resultados/votos/:id/:participantId', adminController.showResumeByParticipant);
router.get('/resultados/votosPorHora/:id', adminController.showResumeByHour);

// Routes used in web app to render views
router.get('/paredao/', adminController.index);
router.get('/paredao/:id', adminController.show);
router.get('/paredao/:id/resumo-geral', adminController.listResumeOfVotes);
router.get('/paredao/:id/votos-por-hora', adminController.listResumeOfVotesByHour);

module.exports = router;