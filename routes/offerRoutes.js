const express = require('express');
const router = express.Router({ mergeParams: true });
const offerController = require('../controllers/offerController');
const { isLoggedIn, isAuthor } = require('../middlewares/auth');

router.post('/', isLoggedIn, offerController.create);
router.get('/', isLoggedIn, isAuthor, offerController.index);
router.put('/:offerId/accept', isLoggedIn, isAuthor, offerController.accept); 

module.exports = router;
