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

  const handleChange = (id, value) => {
    setRespuestas(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e, encuestaId) => {
    e.preventDefault();

    if (!respuestas[encuestaId] || respuestas[encuestaId].trim() === '') {
      setMensaje('Por favor, responde la encuesta antes de enviar.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      await axios.post(`http://localhost:5000/api/encuestas/${encuestaId}/responder`, {
        respuesta: respuestas[encuestaId]
      }, config);

      setMensaje('Gracias por tu respuesta.');
      setRespuestas(prev => ({ ...prev, [encuestaId]: '' })); // Opcional: limpiar la respuesta
    } catch (err) {
      console.error('Error al enviar respuesta:', err);
      setMensaje('Error al enviar respuesta.');
    }

    // Opcional: limpiar mensaje después de 5 segundos
    setTimeout(() => setMensaje(''), 5000);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Encuestas</h1>
      {mensaje && <p className="mb-4 text-green-600">{mensaje}</p>}
      {encuestas.map(encuesta => (
        <form
          key={encuesta._id}
          onSubmit={(e) => handleSubmit(e, encuesta._id)}
          className="mb-6 border p-4 rounded shadow"
        >
          <h2 className="text-lg font-semibold mb-2">{encuesta.pregunta}</h2>
          {encuesta.tipo === 'opcion' ? (
            encuesta.opciones.map((opcion, idx) => (
              <label key={idx} className="block">
                <input
                  type="radio"
                  name={encuesta._id}
                  value={opcion}
                  checked={respuestas[encuesta._id] === opcion}
                  onChange={(e) => handleChange(encuesta._id, e.target.value)}
                  className="mr-2"
                  required
                />
                {opcion}
              </label>
            ))
          ) : (
            <textarea
              placeholder="Escribe tu respuesta..."
              value={respuestas[encuesta._id] || ''}
              onChange={(e) => handleChange(encuesta._id, e.target.value)}
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
  );
};

export default Encuestas;
