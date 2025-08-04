const Encuesta = require("../models/encuesta");

const crearEncuesta = async (req, res) => {
  try {
    const nuevaEncuesta = new Encuesta({
      ...req.body,
      estaCerrada: false, // ← CAMBIO AQUÍ
    });
    const encuestaGuardada = await nuevaEncuesta.save();
    res.status(201).json(encuestaGuardada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const obtenerEncuestas = async (req, res) => {
  try {
    const encuestas = await Encuesta.find();
    res.json(encuestas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const responderEncuesta = async (req, res) => {
  try {
    const { id } = req.params;
    const { respuestas } = req.body;

    const encuesta = await Encuesta.findById(id);
    if (!encuesta) return res.status(404).json({ error: "Encuesta no encontrada" });

    if (encuesta.estaCerrada) {
      return res.status(403).json({ error: "La encuesta está cerrada" });
    }

    encuesta.respuestas.push(...respuestas);
    await encuesta.save();
    res.json({ mensaje: "Respuestas guardadas correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerResultados = async (req, res) => {
  try {
    const encuesta = await Encuesta.findById(req.params.id);
    if (!encuesta) return res.status(404).json({ error: "Encuesta no encontrada" });
    res.json(encuesta.respuestas);
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
    const encuesta = await Encuesta.findByIdAndDelete(req.params.id);
    if (!encuesta) return res.status(404).json({ error: "Encuesta no encontrada" });
    res.json({ mensaje: "Encuesta eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cerrarEncuesta = async (req, res) => {
  try {
    const encuesta = await Encuesta.findById(req.params.id);
    if (!encuesta) return res.status(404).json({ error: "Encuesta no encontrada" });

    encuesta.estaCerrada = true; // ← CAMBIO AQUÍ
    await encuesta.save();

    res.json({ mensaje: "Encuesta cerrada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crearEncuesta,
  obtenerEncuestas,
  responderEncuesta,
  obtenerResultados,
  actualizarEncuesta,
  eliminarEncuesta,
  cerrarEncuesta,
};
