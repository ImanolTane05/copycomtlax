import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminEncuestas = () => {
  const [encuestas, setEncuestas] = useState([]);
  const [resultados, setResultados] = useState({});
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError('No autenticado. Inicie sesión como administrador.');
      return;
    }

    axios.get('http://localhost:5000/api/encuestas')
      .then(res => setEncuestas(res.data))
      .catch(() => setError('Error al cargar encuestas'));
  }, [token]);

  const cargarResultados = async (id) => {
    if (resultados[id]) return;

    try {
      const res = await axios.get(`http://localhost:5000/api/encuestas/resultados/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResultados(prev => ({ ...prev, [id]: res.data }));
      setError(null);
    } catch (err) {
      setError('Error al cargar resultados');
    }
  };

  const contarOpciones = (respuestas, opciones) => {
    const conteo = {};
    opciones.forEach(op => { conteo[op] = 0; });
    respuestas.forEach(r => {
      if (conteo[r.respuesta] !== undefined) conteo[r.respuesta]++;
    });
    return conteo;
  };

  const eliminarEncuesta = async (id) => {
    if (!window.confirm('¿Eliminar esta encuesta?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/encuestas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEncuestas(encuestas.filter(e => e._id !== id));
    } catch (err) {
      setError('Error al eliminar la encuesta');
    }
  };

  const cerrarEncuesta = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/encuestas/${id}/cerrar`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const actualizadas = encuestas.map(e =>
        e._id === id ? { ...e, cerrada: true } : e
      );
      setEncuestas(actualizadas);
    } catch (err) {
      setError('No se pudo cerrar la encuesta');
    }
  };

  const editarEncuesta = (id) => {
    // Puedes redirigir a otra ruta o abrir un modal para editar
    alert(`Redirigir a editar encuesta con ID: ${id}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Resultados de Encuestas</h1>

      {error && <div className="mb-4 p-2 bg-red-200 text-red-700 rounded">{error}</div>}

      {encuestas.map(encuesta => (
        <div key={encuesta._id} className="mb-8 border p-4 rounded shadow">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-semibold text-lg">{encuesta.titulo}</h2>
              <p className="text-sm text-gray-500">Fecha: {new Date(encuesta.fechaCreacion).toLocaleDateString()}</p>
              {encuesta.cerrada && <span className="text-red-600 font-medium">Encuesta cerrada</span>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => editarEncuesta(encuesta._id)}
                className="px-2 py-1 bg-yellow-400 text-black rounded text-sm"
              >
                Editar
              </button>
              <button
                onClick={() => eliminarEncuesta(encuesta._id)}
                className="px-2 py-1 bg-red-500 text-white rounded text-sm"
              >
                Eliminar
              </button>
              {!encuesta.cerrada && (
                <button
                  onClick={() => cerrarEncuesta(encuesta._id)}
                  className="px-2 py-1 bg-gray-700 text-white rounded text-sm"
                >
                  Cerrar
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => cargarResultados(encuesta._id)}
            className="mt-3 mb-4 px-3 py-1 bg-green-600 text-white rounded"
          >
            Ver resultados
          </button>

          {resultados[encuesta._id]?.map((pregunta, i) => (
            <div key={i} className="mb-6">
              <h3 className="font-semibold">{pregunta.texto}</h3>
              {['Cerrada', 'Opción múltiple'].includes(pregunta.tipo) ? (
                pregunta.respuestas.length > 0 ? (
                  <Bar
                    data={{
                      labels: Object.keys(contarOpciones(pregunta.respuestas, pregunta.opciones)),
                      datasets: [{
                        label: 'Respuestas',
                        data: Object.values(contarOpciones(pregunta.respuestas, pregunta.opciones)),
                        backgroundColor: ['#60a5fa', '#34d399', '#f472b6', '#facc15', '#f87171'],
                      }]
                    }}
                    options={{ responsive: true }}
                  />
                ) : (
                  <p className="text-sm italic text-gray-500">Aún no hay respuestas.</p>
                )
              ) : (
                <ul className="mt-2 list-disc list-inside">
                  {pregunta.respuestas.map((r, idx) => (
                    <li key={idx}>{r.respuesta}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AdminEncuestas;
