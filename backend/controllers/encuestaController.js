const Encuesta = require("../models/encuesta");
const Respuesta = require('../models/Respuesta');

const crearEncuesta = async (req, res) => {
    try {
        const nuevaEncuesta = new Encuesta({
            ...req.body,
            cerrada: false, 
            creadaPor: req.user.id,
            fechaPublicacion: new Date(),
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
        const encuestasConResumen = await Promise.all(
            encuestas.map(async (encuesta) => {
                const preguntasConResumen = await Promise.all(
                    encuesta.preguntas.map(async (pregunta) => {
                        if (pregunta.tipo === 'Abierta') {
                            return {
                                ...pregunta.toObject(),
                                resumen: {},
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
        res.json(encuestas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerEncuestaPorId = async (req, res) => {
    try {
        const encuesta = await Encuesta.findById(req.params.id);
        if (!encuesta) {
            return res.status(404).json({ error: "Encuesta no encontrada" });
        }
        res.json(encuesta);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const actualizarEncuesta = async (req, res) => {
    try {
        const encuesta = await Encuesta.findByIdAndUpdate(req.params.id, req.body, {
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
            fecha: new Date(),
        }));
        await Respuesta.insertMany(respuestasDocs);
        res.status(201).json({ message: 'Respuestas guardadas correctamente' });
    } catch (error) {
        console.error('Error al guardar respuestas:', error);
        res.status(500).json({ error: 'Error al guardar respuestas' });
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
};