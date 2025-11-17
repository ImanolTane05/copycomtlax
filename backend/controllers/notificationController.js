const Notificacion = require('../models/Notificacion'); 

/**
 * @route GET /api/notificaciones
 * @desc Obtiene notificaciones generales. (Evita el 401 si no hay token)
 * @access Public (Temporalmente)
 */
exports.getNotifications = async (req, res) => {
    
    // Obtiene el ID del usuario si está disponible (si verifyToken se usó en la ruta)
    // De lo contrario, userId será null, lo que nos permite buscar solo notificaciones generales.
    const userId = req.user ? req.user.id : null; 
    
    try {
        let query = {};
        
        // Si el usuario está autenticado, busca sus notificaciones O las generales.
        if (userId) {
            query = {
                $or: [
                    { userId: userId },
                    { userId: null } 
                ]
            };
        } else {
            // Si no hay sesión (lo que pasa ahora en tu móvil), SOLO busca notificaciones generales
             query = { userId: null };
        }

        const notificaciones = await Notificacion.find(query)
        .sort({ fecha: -1 }) // Ordena por fecha descendente
        .limit(50);          

        // Envía el array (vacío o con datos). Esto resolverá el error 401.
        res.status(200).json(notificaciones);

    } catch (error) {
        console.error("Error al obtener notificaciones de la DB:", error);
        res.status(500).json({ mensaje: "Error interno del servidor al obtener notificaciones." });
    }
};