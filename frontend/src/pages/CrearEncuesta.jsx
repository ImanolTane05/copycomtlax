import React, { useState } from 'react';

const CrearEncuesta = () => {
  const [titulo, setTitulo] = useState('');
  const [preguntas, setPreguntas] = useState([]);
  const [mostrarPopup, setMostrarPopup] = useState(false);
  const [nuevaPregunta, setNuevaPregunta] = useState({
    tipo: '',
    texto: '',
    opciones: [''],
  });

  const tipos = ['Abierta', 'Cerrada', 'Opción múltiple'];

  const agregarPregunta = () => {
    if (!nuevaPregunta.tipo || !nuevaPregunta.texto.trim()) {
      alert('Debe seleccionar tipo y escribir el texto de la pregunta');
      return;
    }
    if (
      ['Cerrada', 'Opción múltiple'].includes(nuevaPregunta.tipo) &&
      nuevaPregunta.opciones.some((op) => !op.trim())
    ) {
      alert('Las opciones no pueden estar vacías');
      return;
    }

    setPreguntas([
      ...preguntas,
      {
        ...nuevaPregunta,
        opciones:
          nuevaPregunta.tipo === 'Abierta' ? [] : nuevaPregunta.opciones,
      },
    ]);

    setNuevaPregunta({ tipo: '', texto: '', opciones: [''] });
    setMostrarPopup(false);
  };

  const guardarEncuesta = async () => {
    if (!titulo.trim()) {
      alert('Debe ingresar un título para la encuesta');
      return;
    }
    if (preguntas.length === 0) {
      alert('Agregue al menos una pregunta');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/encuestas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ titulo, preguntas }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.mensaje || 'Error al crear encuesta');
      }

      alert('Encuesta creada exitosamente');
      setTitulo('');
      setPreguntas([]);
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Crear nueva encuesta
      </h2>

      <input
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Título de la encuesta"
        className="border border-gray-300 p-3 rounded w-full mb-6 focus:outline-none focus:ring-2 focus:ring-blue-600"
      />

      <button
        className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        onClick={() => setMostrarPopup(true)}
      >
        + Agregar pregunta
      </button>

      {preguntas.map((preg, i) => (
        <div
          key={i}
          className="mb-4 p-4 border border-gray-300 rounded bg-gray-50 shadow-sm"
        >
          <strong className="block mb-1 text-gray-700">{preg.tipo}:</strong>
          <p className="text-gray-800 mb-2">{preg.texto}</p>
          {preg.opciones?.length > 0 && (
            <ul className="list-disc list-inside text-gray-700">
              {preg.opciones.map((op, j) => (
                <li key={j}>{op}</li>
              ))}
            </ul>
          )}
        </div>
      ))}

      <button
        onClick={guardarEncuesta}
        className="mt-4 px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
      >
        Guardar Encuesta
      </button>

      {mostrarPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96 max-w-full">
            <h3 className="text-xl font-semibold mb-4 text-gray-900">
              Nueva Pregunta
            </h3>

            <label className="block mb-2 font-semibold text-gray-800">
              Tipo:
            </label>
            <select
              value={nuevaPregunta.tipo}
              onChange={(e) =>
                setNuevaPregunta({
                  ...nuevaPregunta,
                  tipo: e.target.value,
                  opciones: e.target.value === 'Abierta' ? [] : [''],
                })
              }
              className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Seleccione</option>
              {tipos.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>

            <label className="block mb-2 font-semibold text-gray-800">
              Texto:
            </label>
            <input
              type="text"
              value={nuevaPregunta.texto}
              onChange={(e) =>
                setNuevaPregunta({ ...nuevaPregunta, texto: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            {['Cerrada', 'Opción múltiple'].includes(nuevaPregunta.tipo) && (
              <>
                <label className="block mb-2 font-semibold text-gray-800">
                  Opciones:
                </label>
                {nuevaPregunta.opciones.map((op, i) => (
                  <input
                    key={i}
                    type="text"
                    value={op}
                    onChange={(e) => {
                      const opciones = [...nuevaPregunta.opciones];
                      opciones[i] = e.target.value;
                      setNuevaPregunta({ ...nuevaPregunta, opciones });
                    }}
                    className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                ))}
                <button
                  onClick={() =>
                    setNuevaPregunta({
                      ...nuevaPregunta,
                      opciones: [...nuevaPregunta.opciones, ''],
                    })
                  }
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  type="button"
                >
                  + Agregar opción
                </button>
              </>
            )}

            <div className="mt-6 flex justify-between">
              <button
                onClick={agregarPregunta}
                className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition"
                type="button"
              >
                Guardar pregunta
              </button>
              <button
                onClick={() => setMostrarPopup(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded font-semibold hover:bg-gray-500 transition"
                type="button"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrearEncuesta;
