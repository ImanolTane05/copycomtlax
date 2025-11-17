const mongoose = require('mongoose');

// Este modelo guarda los tokens de Expo de los usuarios
// que se usaran para enviar notificaciones push.
const userTokenSchema = new mongoose.Schema({
    // El token único generado por Expo para un dispositivo específico.
    token: {
        type: String,
        required: true,
        unique: true, // Asegura que no se guarden tokens duplicados
    },
    // Opcional: puedes añadir un campo para saber cuándo se creó o actualizó el token
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('UserToken', userTokenSchema);