var express               = require('express');
var router                = express.Router();
var eliminationController = require('../controllers/elimination-controller');

router.get('/', eliminationController.list);
router.get('/:id', eliminationController.show);
router.put('/:id', eliminationController.update);
router.post('/', eliminationController.create);

module.exports = router;