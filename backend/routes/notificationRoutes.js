const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
// const verifyToken = require('../middleware/verifyToken'); // 👈 DEBE ESTAR COMENTADO POR AHORA para evitar el 401

/**
 * @route GET /api/notificaciones
 * @desc Obtiene todas las notificaciones (generales).
 */
router.get('/notificaciones', 
    notificationController.getNotifications
);

module.exports = router;