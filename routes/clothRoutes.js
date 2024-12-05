const express = require('express');
const router = express.Router();
const clothController = require('../controllers/clothController');
const offerController = require('../controllers/offerController');
const { isLoggedIn, isAuthor } = require('../middlewares/auth');
const { validateId, validateResult } = require('../middlewares/validator');
const offerRoutes = require('./offerRoutes');  

router.get('/', clothController.index);
router.get('/new', isLoggedIn, clothController.new);
router.post('/', isLoggedIn, validateResult, clothController.create);
router.get('/:id', validateId, clothController.show);
router.get('/:id/edit', validateId, isLoggedIn, isAuthor, clothController.edit);
router.put('/:id', validateId, isLoggedIn, isAuthor, validateResult, clothController.update);
router.delete('/:id', validateId, isLoggedIn, isAuthor, clothController.delete);
router.get('/:itemId/offers', isLoggedIn, isAuthor, offerController.index);
router.put('/:itemId/offers/:offerId/accept', isLoggedIn, isAuthor, offerController.accept);
router.use('/:itemId/offers', offerRoutes); 

module.exports = router;
