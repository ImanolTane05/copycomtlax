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
      alert('Debe seleccionar tipo y escribir texto de la pregunta');
      return;
    }
    if (['Cerrada', 'Opción múltiple'].includes(nuevaPregunta.tipo)) {
      // validar que todas las opciones no estén vacías
      if (nuevaPregunta.opciones.some(op => !op.trim())) {
        alert('Las opciones no pueden estar vacías');
        return;
      }
    } else {
      // para preguntas abiertas no debe haber opciones
      nuevaPregunta.opciones = [];
    }
    setPreguntas([...preguntas, nuevaPregunta]);
    setNuevaPregunta({ tipo: '', texto: '', opciones: [''] });
    setMostrarPopup(false);
  };

  const guardarEncuesta = async () => {
    if (!titulo.trim()) {
      alert('Debe poner un título a la encuesta');
      return;
    }
    if (preguntas.length === 0) {
      alert('Debe agregar al menos una pregunta');
      return;
    }

    // Adaptar preguntas para backend: tipos en minúsculas, opciones siempre array (aunque vacío)
    const preguntasBackend = preguntas.map(p => ({
      texto: p.texto.trim(),
      tipo: p.tipo === 'Abierta' ? 'abierta' : 'opcion',
      opciones: p.tipo === 'Abierta' ? [] : p.opciones,
    }));

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/encuestas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ titulo: titulo.trim(), preguntas: preguntasBackend }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.mensaje || 'Error al crear encuesta');
      }

      alert('Encuesta guardada correctamente');
      setTitulo('');
      setPreguntas([]);
    } catch (err) {
      console.error('Error al crear encuesta:', err);
      alert('Error al guardar la encuesta: ' + err.message);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Crear nueva encuesta</h2>
      <input
        type="text"
        placeholder="Título de la encuesta"
        value={titulo}
        onChange={e => setTitulo(e.target.value)}
        className="border p-2 w-full mb-4 rounded"
      />
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => setMostrarPopup(true)}
      >
        + Agregar pregunta
      </button>

      {preguntas.map((preg, i) => (
        <div key={i} className="border p-2 mb-2 rounded">
          <strong>{preg.tipo}:</strong> {preg.texto}
          {preg.opciones?.length > 0 && (
            <ul className="list-disc ml-6">
              {preg.opciones.map((op, j) => (
                <li key={j}>{op}</li>
              ))}
            </ul>
          )}
        </div>
      ))}

      <button
        onClick={guardarEncuesta}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        Guardar Encuesta
      </button>

      {mostrarPopup && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white p-6 border rounded shadow-lg z-50 w-80">
          <h3 className="mb-2 font-semibold text-lg">Agregar nueva pregunta</h3>
          <label>Tipo de pregunta:</label>
          <select
            value={nuevaPregunta.tipo}
            onChange={e =>
              setNuevaPregunta({ ...nuevaPregunta, tipo: e.target.value })
            }
            className="border p-1 w-full mb-2"
          >
            <option value="">Seleccione</option>
            {tipos.map(tipo => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
          <label>Texto de la pregunta:</label>
          <input
            type="text"
            value={nuevaPregunta.texto}
            onChange={e =>
              setNuevaPregunta({ ...nuevaPregunta, texto: e.target.value })
            }
            className="border p-1 w-full mb-2"
          />
          {['Opción múltiple', 'Cerrada'].includes(nuevaPregunta.tipo) && (
            <>
              <label>Opciones:</label>
              {nuevaPregunta.opciones.map((op, i) => (
                <input
                  key={i}
                  type="text"
                  value={op}
                  onChange={e => {
                    const ops = [...nuevaPregunta.opciones];
                    ops[i] = e.target.value;
                    setNuevaPregunta({ ...nuevaPregunta, opciones: ops });
                  }}
                  className="border p-1 w-full mb-1"
                />
              ))}
              <button
                type="button"
                onClick={() =>
                  setNuevaPregunta({
                    ...nuevaPregunta,
                    opciones: [...nuevaPregunta.opciones, ''],
                  })
                }
                className="mb-2 px-2 py-1 bg-gray-300 rounded"
              >
                + Agregar opción
              </button>
            </>
          )}
          <div className="flex justify-between">
            <button
              onClick={agregarPregunta}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Guardar pregunta
            </button>
            <button
              onClick={() => setMostrarPopup(false)}
              className="bg-gray-400 text-white px-3 py-1 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrearEncuesta;
