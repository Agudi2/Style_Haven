const express = require('express');
const router = express.Router();
const clothController = require('../controllers/clothController');
const { isLoggedIn, isAuthor } = require('../middlewares/auth');


router.get('/', clothController.index);
router.get('/new', isLoggedIn, clothController.new);
router.post('/', isLoggedIn, clothController.create);
router.get('/:id', clothController.show);
router.get('/:id/edit', isLoggedIn, isAuthor, clothController.edit);
router.put('/:id', isLoggedIn, isAuthor, clothController.update);
router.delete('/:id', isLoggedIn, isAuthor, clothController.delete);



module.exports = router;
