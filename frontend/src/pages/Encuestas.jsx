import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Encuestas = () => {
  const [encuestas, setEncuestas] = useState([]);
  const [respuestas, setRespuestas] = useState({}); // { encuestaId: { preguntaId: respuesta, ... }, ... }
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/encuestas')
      .then((res) => setEncuestas(res.data))
      .catch((err) => console.error('Error al cargar encuestas:', err));
  }, []);

  const handleChange = (encuestaId, preguntaId, value) => {
    setRespuestas((prev) => ({
      ...prev,
      [encuestaId]: {
        ...prev[encuestaId],
        [preguntaId]: value,
      },
    }));
  };

  const handleSubmit = async (e, encuestaId) => {
    e.preventDefault();

    const respuestasEncuesta = respuestas[encuestaId];
    if (!respuestasEncuesta) {
      setMensaje('Por favor, responde al menos una pregunta.');
      return;
    }

    // Validar que todas las preguntas tengan respuesta
    const encuesta = encuestas.find((enc) => enc._id === encuestaId);
    const preguntasSinRespuesta = encuesta.preguntas.filter(
      (p) => !respuestasEncuesta[p._id] || respuestasEncuesta[p._id].toString().trim() === ''
    );

    if (preguntasSinRespuesta.length > 0) {
      setMensaje('Por favor, responde todas las preguntas antes de enviar.');
      return;
    }

    // Preparar array para enviar
    const respuestasArray = Object.entries(respuestasEncuesta).map(([preguntaId, respuesta]) => ({
      preguntaId,
      respuesta,
    }));

    try {
      await axios.post(`http://localhost:5000/api/encuestas/${encuestaId}/responder`, {
        respuestas: respuestasArray,
        usuarioId: null, // si tienes usuario puedes ponerlo aquí
      });

      setMensaje('Gracias por enviar tus respuestas.');

      // Limpiar respuestas para esa encuesta
      setRespuestas((prev) => ({
        ...prev,
        [encuestaId]: {},
      }));
    } catch (err) {
      setMensaje('Error al enviar respuestas.');
      console.error(err);
    }

    setTimeout(() => setMensaje(''), 5000);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900">Encuestas</h1>
      {mensaje && <p className="mb-6 text-green-600 font-semibold">{mensaje}</p>}

      {encuestas.length === 0 && <p>No hay encuestas disponibles.</p>}

      {encuestas.map((encuesta) => (
        <form
          key={encuesta._id}
          onSubmit={(e) => handleSubmit(e, encuesta._id)}
          className="mb-10 p-6 border rounded-xl shadow-md bg-white"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">{encuesta.titulo}</h2>

          {encuesta.cerrada && (
            <p className="mb-4 text-red-600 font-semibold">Esta encuesta está cerrada</p>
          )}

          {encuesta.preguntas.map((pregunta) => (
            <div key={pregunta._id} className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-700">{pregunta.texto}</h3>

              {['Cerrada', 'Opción múltiple'].includes(pregunta.tipo) ? (
                pregunta.opciones.map((opcion, idx) => (
                  <label
                    key={idx}
                    className="block cursor-pointer mb-2 text-gray-700 hover:text-blue-600"
                  >
                    <input
                      type="radio"
                      name={pregunta._id}
                      value={opcion}
                      checked={respuestas[encuesta._id]?.[pregunta._id] === opcion}
                      onChange={(e) =>
                        handleChange(encuesta._id, pregunta._id, e.target.value)
                      }
                      className="mr-3"
                      required
                      disabled={encuesta.cerrada}
                    />
                    {opcion}
                  </label>
                ))
              ) : (
                <textarea
                  placeholder="Escribe tu respuesta..."
                  value={respuestas[encuesta._id]?.[pregunta._id] || ''}
                  onChange={(e) =>
                    handleChange(encuesta._id, pregunta._id, e.target.value)
                  }
                  className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  disabled={encuesta.cerrada}
                  required
                  rows={4}
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={encuesta.cerrada}
            className={`mt-4 px-6 py-2 rounded font-semibold text-white ${
              encuesta.cerrada
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } transition`}
          >
            Enviar respuestas
          </button>
        </form>
      ))}
    </div>
  );
};

export default Encuestas;
