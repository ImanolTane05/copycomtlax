const { Expo } = require('expo-server-sdk');
const expo = new Expo();
const UserToken = require('../models/UserToken');

/**
 * Obtiene todos los tokens registrados en la DB.
 * @returns {Promise<string[]>} Lista de tokens de Expo válidos.
 */
async function getAllTokens() {
    try {
        const tokens = await UserToken.find({});
        // Mapeamos a un array de strings y filtramos los tokens inválidos
        return tokens.map(t => t.token).filter(token => Expo.isExpoPushToken(token));
    } catch (err) {
        console.error("Error al obtener tokens de la DB:", err.message);
        return [];
    }
}

/**
 * Envía una notificación push a todos los dispositivos.
 * @param {string} title - Título visible de la notificación (null si es silenciosa).
 * @param {string} body - Cuerpo visible de la notificación (null si es silenciosa).
 * @param {object} data - Payload de datos para el cliente (ID, tipo, acción).
 * @param {boolean} isSilent - Si es true, solo se envía el payload de datos (útil para la acción 'deleted').
 */
exports.sendPushNotification = async (title, body, data, isSilent = false) => {
    const pushTokens = await getAllTokens();

    if (pushTokens.length === 0) {
        console.log("No hay tokens registrados. No se envían notificaciones.");
        return;
    }

    let messages = [];
    for (let pushToken of pushTokens) {
        const message = {
            to: pushToken,
            data: data, // El payload de datos es lo más importante
        };

        // Si NO es silenciosa (Noticia/Encuesta creada), añadimos título, cuerpo y sonido.
        if (!isSilent) {
            message.sound = 'default';
            message.title = title;
            message.body = body;
        }
        // Si es silenciosa (Noticia/Encuesta eliminada), solo enviamos 'to' y 'data'.

        messages.push(message);
    }

    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];

    // Enviamos los chunks al servicio de Expo.
    for (let chunk of chunks) {
        try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        } catch (error) {
            console.error('Error al enviar chunk de notificaciones:', error);
        }
    }
    
    console.log(`Notificaciones enviadas. ${tickets.length} tickets generados.`);
};