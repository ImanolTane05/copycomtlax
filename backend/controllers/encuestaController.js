const Encuesta = require("../models/encuesta");
const Respuesta = require('../models/Respuesta');
const { genAI } = require('../geminiConfig');

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
        await Encuesta.findByIdAndDelete(encuestaId);
        await Respuesta.deleteMany({ encuestaId });
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
        
        const prompt = `Analiza las siguientes respuestas de una pregunta abierta y proporciona un resumen conciso y una evaluación de sentimiento general. Las respuestas están separadas por "---".
        
        Respuestas:
        ${textoRespuestas}
        
        Responde en formato JSON con las siguientes propiedades:
        - "resumen_general": Un resumen de 2-3 frases que capture las ideas principales.
        - "sentimiento_general": "Positivo", "Negativo" o "Mixto".
        - "puntos_clave": Un array de 3 a 5 puntos que resuman los temas principales.
        - "frases_clave": Un array de 3 a 5 frases textuales de las respuestas que mejor representen los puntos clave.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const resumenGemini = JSON.parse(jsonMatch[0]);
            res.json(resumenGemini);
        } else {
            res.status(500).json({ error: "No se pudo obtener un resumen válido de Gemini." });
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