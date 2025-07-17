import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Encuestas = () => {
  const [encuestas, setEncuestas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/encuestas')
      .then(res => setEncuestas(res.data))
      .catch(err => console.error('Error al cargar encuestas:', err));
  }, []);

  // Actualiza la respuesta del usuario para una pregunta específica de una encuesta
  const handleChange = (encuestaId, preguntaId, value) => {
    setRespuestas(prev => ({
      ...prev,
      [encuestaId]: {
        ...prev[encuestaId],
        [preguntaId]: value,
      }
    }));
  };

  // Envía la respuesta para una pregunta específica
  const handleSubmit = async (e, encuestaId, preguntaId) => {
    e.preventDefault();

    const respuesta = respuestas[encuestaId]?.[preguntaId];
    if (!respuesta || (typeof respuesta === 'string' && respuesta.trim() === '')) {
      setMensaje('Por favor, responde la pregunta antes de enviar.');
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/encuestas/${encuestaId}/responder`, {
        preguntaId,
        respuesta
      });
      setMensaje('Gracias por tu respuesta.');

      // Limpia la respuesta del formulario para esa pregunta
      setRespuestas(prev => ({
        ...prev,
        [encuestaId]: {
          ...prev[encuestaId],
          [preguntaId]: '',
        }
      }));
    } catch (err) {
      setMensaje('Error al enviar respuesta.');
    }

    setTimeout(() => setMensaje(''), 5000);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Encuestas</h1>
      {mensaje && <p className="mb-4 text-green-600">{mensaje}</p>}

      {encuestas.map(encuesta => (
        <div key={encuesta._id} className="mb-6 border p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">{encuesta.titulo}</h2>

          {encuesta.preguntas.map(pregunta => (
            <form
              key={pregunta._id}
              onSubmit={(e) => handleSubmit(e, encuesta._id, pregunta._id)}
              className="mb-4"
            >
              <h3 className="mb-2">{pregunta.texto}</h3>

              {['Cerrada', 'Opción múltiple'].includes(pregunta.tipo) ? (
                pregunta.opciones.map((opcion, idx) => (
                  <label key={idx} className="block cursor-pointer">
                    <input
                      type="radio"
                      name={pregunta._id}
                      value={opcion}
                      checked={respuestas[encuesta._id]?.[pregunta._id] === opcion}
                      onChange={e => handleChange(encuesta._id, pregunta._id, e.target.value)}
                      className="mr-2"
                      required
                    />
                    {opcion}
                  </label>
                ))
              ) : (
                <textarea
                  placeholder="Escribe tu respuesta..."
                  value={respuestas[encuesta._id]?.[pregunta._id] || ''}
                  onChange={e => handleChange(encuesta._id, pregunta._id, e.target.value)}
                  className="w-full border rounded p-2"
                  required
                />
              )}

              <button
                type="submit"
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Enviar respuesta
              </button>
            </form>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Encuestas;
