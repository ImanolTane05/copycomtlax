const Notificacion = require('../models/Notificacion');

/**
 * @route GET /api/notificaciones
 * @desc Obtiene notificaciones generales o del usuario logueado
 * @access Público temporal
 */
exports.getNotifications = async (req, res) => {
    const userId = req.user?.id || null;

    try {
        const query = userId
            ? { $or: [{ userId }, { userId: null }] }
            : { userId: null };

        const notificaciones = await Notificacion.find(query)
            .sort({ fecha: -1 })
            .limit(50);

        return res.status(200).json(notificaciones);
    } catch (error) {
        console.error("❌ Error al obtener notificaciones:", error);
        return res.status(500).json({ mensaje: "Error interno del servidor." });
    }
};


/**
 * @route PATCH /api/notificaciones/:id/leida
 * @desc Marca una notificación como leída
 */
exports.markAsRead = async (req, res) => {
    const { id } = req.params;

    try {
        const notif = await Notificacion.findByIdAndUpdate(
            id,
            { leida: true },
            { new: true }
        );

        if (!notif) return res.status(404).json({ mensaje: "Notificación no encontrada" });

        return res.status(200).json(notif);
    } catch (error) {
        console.error("❌ Error al marcar leída:", error);
        return res.status(500).json({ mensaje: "Error interno" });
    }
};


/**
 * @route DELETE /api/notificaciones/:id
 * @desc Elimina notificación
 */
exports.deleteNotification = async (req, res) => {
    const { id } = req.params;

    try {
        const notif = await Notificacion.findByIdAndDelete(id);

        if (!notif) return res.status(404).json({ mensaje: "Notificación no encontrada" });

        return res.status(200).json({ mensaje: "Notificación eliminada" });
    } catch (error) {
        console.error("❌ Error al eliminar:", error);
        return res.status(500).json({ mensaje: "Error interno" });
    }
};
