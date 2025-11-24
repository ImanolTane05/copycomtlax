const Encuesta = require("../models/Encuesta");
const Respuesta = require('../models/Respuesta');
const { genAI } = require('../geminiConfig');
// Importar el servicio de envío de notificaciones push
const pushService = require('../utils/pushService');
const Notificacion = require('../models/Notificacion');

// Función auxiliar para verificar y actualizar el estado de la encuesta
const verificarCierreProgramado = async (encuesta) => {
    if (encuesta.fechaCierre && !encuesta.cerrada) {
        if (new Date() > encuesta.fechaCierre) {
            encuesta.cerrada = true;
            await encuesta.save();
        }
    }
    return encuesta;
};

const crearEncuesta = async (req, res) => {
    try {
        const { fechaCierre, ...resto } = req.body;
        const nuevaEncuesta = new Encuesta({
            ...resto,
            cerrada: false,
            creadaPor: req.user.id,
            fechaPublicacion: new Date(),
            fechaCierre: fechaCierre || null,
        });
        const encuestaGuardada = await nuevaEncuesta.save();

        // Crear notificación EN BASE DE DATOS (Mongo)
        await Notificacion.create({
            titulo: "Nueva Encuesta",
            descripcion: encuestaGuardada.titulo,
            tipo: "Encuesta",
            linkId: encuestaGuardada._id
        });

        // Lógica de Notificación Push para CREACIÓN
        pushService.sendPushNotification(
            '¡Nueva Encuesta Disponible!', 
            encuestaGuardada.titulo,     
            { type: 'encuesta', id: encuestaGuardada._id.toString(), action: 'created' }, 
            false 
        );

        res.status(201).json(encuestaGuardada);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const obtenerEncuestasAdmin = async (req, res) => {
    try {
        const encuestas = await Encuesta.find();
        const encuestasProcesadas = await Promise.all(encuestas.map(verificarCierreProgramado));

        const encuestasConResumen = await Promise.all(
            encuestasProcesadas.map(async (encuesta) => {
                const totalVotos = await Respuesta.countDocuments({ encuestaId: encuesta._id });

                const preguntasConResumen = await Promise.all(
                    encuesta.preguntas.map(async (pregunta) => {
                        if (pregunta.tipo === 'Abierta') {
                            return { ...pregunta.toObject(), resumen: null }; 
                        } else if (pregunta.tipo === 'Opción múltiple') {
                            const respuestas = await Respuesta.aggregate([
                                { $match: { encuestaId: encuesta._id, preguntaId: pregunta._id } },
                                { $unwind: '$respuesta' },
                                { $group: { _id: '$respuesta', count: { $sum: 1 } } },
                            ]);
                            const resumen = {};
                            respuestas.forEach((r) => {
                                resumen[r._id] = r.count;
                            });
                            return {
                                ...pregunta.toObject(),
                                resumen,
                            };
                        } else {
                            const respuestas = await Respuesta.aggregate([
                                { $match: { encuestaId: encuesta._id, preguntaId: pregunta._id } },
                                { $group: { _id: '$respuesta', count: { $sum: 1 } } },
                            ]);
                            const resumen = {};
                            respuestas.forEach((r) => {
                                resumen[r._id] = r.count;
                            });
                            return {
                                ...pregunta.toObject(),
                                resumen,
                            };
                        }
                    })
                );
                return {
                    ...encuesta.toObject(),
                    preguntas: preguntasConResumen,
                    totalVotos: totalVotos
                };
            })
        );
        res.json(encuestasConResumen);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener encuestas con resultados' });
    }
};

const obtenerEncuestasPublicas = async (req, res) => {
    try {
        const encuestas = await Encuesta.find({ cerrada: { $ne: true } });
        const encuestasProcesadas = await Promise.all(encuestas.map(verificarCierreProgramado));
        res.json(encuestasProcesadas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerEncuestaPorId = async (req, res) => {
    try {
        const encuesta = await Encuesta.findById(req.params.id)
            .populate('preguntas')
            .exec();

        if (!encuesta) {
            return res.status(404).json({ error: "Encuesta no encontrada" });
        }
        const encuestaProcesada = await verificarCierreProgramado(encuesta);

        res.json(encuestaProcesada);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const actualizarEncuesta = async (req, res) => {
    try {
        const encuestaId = req.params.id;
        const { fechaCierre, ...resto } = req.body;
        const encuesta = await Encuesta.findByIdAndUpdate(encuestaId, { ...resto, fechaCierre }, {
            new: true,
        });
        if (!encuesta) return res.status(404).json({ error: "Encuesta no encontrada" });
        res.json(encuesta);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const eliminarEncuesta = async (req, res) => {
    try {
        const encuestaId = req.params.id;
        const encuestaEliminada = await Encuesta.findByIdAndDelete(encuestaId);
        
        if (!encuestaEliminada) {
            return res.status(404).json({ error: "Encuesta no encontrada" });
        }
        
        await Respuesta.deleteMany({ encuestaId });

        pushService.sendPushNotification(
            null,
            null,
            { type: 'encuesta', id: encuestaId, action: 'deleted' },
            true 
        );

        res.json({ mensaje: "Encuesta y respuestas eliminadas correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const cambiarEstadoEncuesta = async (req, res) => {
    try {
        const { cerrada } = req.body;
        const encuesta = await Encuesta.findByIdAndUpdate(req.params.id, { cerrada }, { new: true });
        if (!encuesta) return res.status(404).json({ error: 'Encuesta no encontrada' });
        res.json(encuesta);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar el estado de la encuesta' });
    }
};

const responderEncuesta = async (req, res) => {
    try {
        const encuestaId = req.params.id;
        const { respuestas, usuarioId } = req.body;
        const encuesta = await Encuesta.findById(encuestaId);
        if (!encuesta) return res.status(404).json({ error: 'Encuesta no encontrada' });
        if (encuesta.cerrada) {
            return res.status(403).json({ error: "La encuesta está cerrada y no puede recibir respuestas." });
        }
        if (!Array.isArray(respuestas) || respuestas.length === 0) {
            return res.status(400).json({ error: 'No se enviaron respuestas válidas' });
        }
        const respuestasDocs = respuestas.map((r) => ({
            encuestaId,
            preguntaId: r.preguntaId,
            usuarioId: usuarioId || null,
            respuesta: r.respuesta,
        }));
        await Respuesta.insertMany(respuestasDocs);
        res.status(201).json({ message: 'Respuestas guardadas correctamente' });
    } catch (error) {
        console.error('Error al guardar respuestas:', error);
        res.status(500).json({ error: 'Error al guardar respuestas' });
    }
};

const obtenerResumenRespuestasAbiertas = async (req, res) => {
    try {
        const { encuestaId, preguntaId } = req.params;
        const respuestasAbiertas = await Respuesta.find({
            encuestaId,
            preguntaId,
        }, 'respuesta');

        if (respuestasAbiertas.length === 0) {
            return res.json({ resumen: 'No hay respuestas para resumir.' });
        }
        
        const textoRespuestas = respuestasAbiertas.map(r => r.respuesta).join('\n---\n');

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
        
        const prompt = `
Eres un analista experto en datos cualitativos de encuestas. Tu tarea es procesar las respuestas abiertas proporcionadas a continuación para extraer información clave de manera concisa, clara y objetiva.

**Instrucciones de Análisis:**
1.  Analiza el conjunto de respuestas. Las respuestas individuales están separadas por "---".
2.  Identifica los temas, patrones, quejas o elogios recurrentes.
3.  Determina el sentimiento general predominante.
4.  Mantén un tono profesional y objetivo.

**Formato de Salida:**
Debes responder *exclusivamente* con un objeto JSON válido, siguiendo rigurosamente este esquema y sin incluir texto adicional fuera del JSON.

Respuestas a Analizar:
${textoRespuestas}

Responde en formato JSON con las siguientes propiedades:
- "resumen_ejecutivo": Un resumen ejecutivo de máximo tres (3) frases, profesional y objetivo, que sintetice el hallazgo más importante, los temas centrales y cualquier implicación notable para el negocio o la pregunta. Debe ser la conclusión más clara.
- "sentimiento_dominante": Determina el sentimiento general entre estas categorías para mayor granularidad: "Altamente Positivo", "Positivo", "Mixto/Neutral", "Negativo" o "Altamente Negativo".
- "temas_emergentes": Un array de **cinco (5)** puntos de análisis. Cada punto debe ser una frase que describa un tema o idea principal recurrente y significativo encontrado en las respuestas.
- "citas_representativas": Un array de **tres (3)** citas textuales (frases exactas de las respuestas) que sirvan como la mejor evidencia o ejemplo para ilustrar los temas emergentes.
`;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const resumenGemini = JSON.parse(jsonMatch[0]);
            res.json(resumenGemini);
        } else {
            res.status(500).json({ 
                error: "No se pudo obtener un resumen válido de Gemini.",
                rawResponse: text 
            });
        }

    } catch (error) {
        console.error("Error al obtener resumen con Gemini:", error);
        res.status(500).json({ error: "Error al procesar las respuestas con la IA." });
    }
};

module.exports = {
    crearEncuesta,
    obtenerEncuestasAdmin,
    obtenerEncuestasPublicas,
    obtenerEncuestaPorId,
    actualizarEncuesta,
    eliminarEncuesta,
    cambiarEstadoEncuesta,
    responderEncuesta,
    obtenerResumenRespuestasAbiertas,
};