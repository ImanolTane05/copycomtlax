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
    axios.get('http://localhost:5000/api/encuestas')
      .then(res => setEncuestas(res.data))
      .catch(err => setError('Error al cargar encuestas'));
  }, []);

  const cargarResultados = async (id) => {
    if (!token) {
      setError('No autenticado para ver resultados');
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/api/encuestas/resultados/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResultados(prev => ({ ...prev, [id]: res.data }));
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Error al cargar resultados');
    }
  };

  const contarOpciones = (respuestas) => {
    const conteo = {};
    respuestas.forEach(r => {
      const val = r.respuesta;
      conteo[val] = (conteo[val] || 0) + 1;
    });
    return conteo;
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Resultados de Encuestas</h1>

      {error && (
        <div className="mb-4 p-2 bg-red-200 text-red-700 rounded">{error}</div>
      )}

      {encuestas.map(encuesta => (
        <div key={encuesta._id} className="mb-8 border p-4 rounded shadow">
          <h2 className="font-semibold">{encuesta.pregunta}</h2>
          <button
            onClick={() => cargarResultados(encuesta._id)}
            className="mt-2 px-3 py-1 bg-green-600 text-white rounded"
          >
            Ver resultados
          </button>

          {resultados[encuesta._id] && encuesta.tipo === 'opcion' && (
            <Bar
              data={{
                labels: Object.keys(contarOpciones(resultados[encuesta._id])),
                datasets: [{
                  label: 'Respuestas',
                  data: Object.values(contarOpciones(resultados[encuesta._id])),
                  backgroundColor: ['#60a5fa', '#34d399', '#f472b6'],
                }]
              }}
              options={{ responsive: true }}
            />
          )}

          {resultados[encuesta._id] && encuesta.tipo === 'abierta' && (
            <ul className="mt-4 list-disc list-inside">
              {resultados[encuesta._id].map((r, idx) => (
                <li key={idx} className="text-gray-700">{r.respuesta}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminEncuestas;
