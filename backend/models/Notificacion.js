const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Definición del esquema para las notificaciones
const NotificacionSchema = new Schema({
    // Campo para el título principal de la notificación
    titulo: {
        type: String,
        required: [true, 'El título de la notificación es obligatorio.'],
        trim: true,
    },
    
    // Campo para la descripción o cuerpo del mensaje
    descripcion: {
        type: String,
        required: [true, 'La descripción de la notificación es obligatoria.'],
        trim: true,
    },
    
    // Campo para vincular la notificación a un usuario específico (privada)
    // Si este campo es 'null', se asume que la notificación es general para todos.
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Asume que tienes un modelo User
        default: null, // Puede ser null para notificaciones generales
        index: true,
    },

    // Estado de lectura para el usuario. Crucial para la interfaz móvil.
    leida: {
        type: Boolean,
        default: false,
    },
    
    // Tipo de notificación para asignar iconos y lógica de navegación en el frontend
    // Ejemplos: 'Alerta', 'Noticia', 'Encuesta', 'Sistema'
    tipo: {
        type: String,
        enum: ['Alerta', 'Noticia', 'Encuesta', 'Sistema', 'Otro'],
        default: 'Sistema',
    },

    // Referencia al ID del elemento relacionado (Noticia, Encuesta, etc.)
    // Esto es útil si el clic en la notificación debe abrir un detalle específico.
    linkId: {
        type: Schema.Types.ObjectId,
        ref: 'mixed', // Puede referenciar a diferentes modelos
        default: null,
    },
    
    // Fecha de creación, usada para ordenar (las más recientes primero)
    fecha: {
        type: Date,
        default: Date.now,
        index: true,
    }
}, {
    // Añade automáticamente createdAt y updatedAt
    timestamps: true 
});

// Exporta el modelo
module.exports = mongoose.model('Notificacion', NotificacionSchema);