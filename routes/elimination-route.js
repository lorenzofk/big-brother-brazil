var express               = require('express');
var router                = express.Router();
var eliminationController = require('../controllers/elimination-controller');

router.get('/', eliminationController.list);
router.put('/:eliminationId', eliminationController.update);
router.post('/', eliminationController.create);

module.exports = router;