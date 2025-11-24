const express = require('express');
const router = express.Router();

const {
    getNotifications,
    markAsRead,
    deleteNotification
} = require('../controllers/notificationController');

// Todas las notificaciones
router.get('/notificaciones', getNotifications);

// Marcar como leída
router.patch('/notificaciones/:id/leida', markAsRead);

// Eliminar notificación
router.delete('/notificaciones/:id', deleteNotification);

module.exports = router;
