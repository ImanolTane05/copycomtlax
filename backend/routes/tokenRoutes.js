const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/tokenController');

// Ruta para que la app móvil envíe su token push.
router.post('/register', tokenController.registerToken);

module.exports = router;